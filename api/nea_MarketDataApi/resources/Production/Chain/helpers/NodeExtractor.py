from numpy import inf

from nea_schema.maria.sde.bp import Activity, Product
from nea_schema.maria.sde.inv import Type

from . import LoggingBase, calc_invent_chance, calc_mat_needs, calc_prod_time, parse_type_item
from .CopyProduct import CopyProduct
from .ProcessExtractor import ProcessExtractor

class NodeExtractor(LoggingBase):
    def __init__(self, conn, parent=None, endpoint=False):
        self._init_logging(parent, endpoint)
        self._conn = conn
        
    def extract_node(self, type_id, output_units, station_ids, ignore_activity):
        product_items = self._conn.query(Product).filter_by(type_id=type_id)\
            .filter(Product.activity_type.notin_(ignore_activity))
        
        if product_items.count() == 0:
            copy_activity_items = self._conn.query(Activity).filter_by(activity_type='copying', blueprint_id=type_id)
            product_items = [CopyProduct(activity_item) for activity_item in copy_activity_items]
            if len(product_items) == 0:
                return self._parse_market_node(type_id, output_units)
        
        node = self._parse_node_scaffold(type_id, output_units)
        node['process_options'] = ProcessExtractor(self._conn).extract_processes(product_items, station_ids)
        node['process'], node['materials'] = self._construct_processes(node['process_options'], output_units)
        
        return node
        
    def _parse_node_scaffold(self, type_id, output_units):
        node = {
            'node_id': type_id,
            'output_units': output_units,
            'type': parse_type_item(self._conn.query(Type).filter_by(type_id=type_id).one()),
            'materials': {},
        }
        return node
    
    def _parse_market_node(self, type_id, output_units):
        process = self._extract_market_process(type_id, output_units)
        node = {
            **self._parse_node_scaffold(type_id, output_units),
            'process': [process],
            'process_options': [process],
            'materials': [],
        }
        return node
        
    def _extract_market_process(self, type_id, output_units):
        process = {
            'product': {
                'type': parse_type_item(self._conn.query(Type).filter_by(type_id=type_id).one()),
                'quantity': 1,
                'probability': 1,
            },
            'activity': {'type': 'purchase', 'time': 0},
            'batch': {'runs': output_units, 'units': output_units, 'seconds': 0},
        }
        return process
        
    def _construct_processes(self, process_options, remaining_units):
        processes = []
        materials = {}
        for process in process_options:
            try:
                remaining_runs = self._build_remaining_runs(process['blueprint'])
            except Exception as E:
                print(process)
                raise E
            chance = calc_invent_chance(process['product']['probability'])
            units_per_run = process['product']['quantity'] * chance
            max_units_per_batch = process['blueprint']['max_production_limit'] * units_per_run\
                if process['blueprint']['function'] not in ['bp']\
                else inf


            while remaining_runs > 0:
                batch_units = min(remaining_units, remaining_runs * units_per_run, max_units_per_batch)
                batch_runs = batch_units / units_per_run
                batch_seconds = calc_prod_time(
                    process['activity']['time'],
                    process['blueprint']['time_efficiency'],
                    process['station_industry'].get('strEngTimeBonus', 1),
                    batch_runs,
                )
                
                batch = {
                    'runs': batch_runs,
                    'chance': chance,
                    'units': batch_units,
                    'seconds': batch_seconds,
                }
                
                process = self._build_process(process, batch)
                
                for material in process['materials']:
                    materials[material['type']['id']] = materials.get(material['type']['id'], 0) + material['usage']
                    
                processes.append(process)

                remaining_units -= batch_units
                remaining_runs -= batch_runs
                
                if remaining_units <= 0: break
            if remaining_units <= 0: break
        
        materials = [
            {'type_id': key, 'quantity': val}
            for key, val in materials.items()
        ]
        return processes, materials
            
    @staticmethod
    def _build_remaining_runs(blueprint):
        if blueprint['function'] in ['bp', 'reaction', 'placeholder']:
            return inf
        elif blueprint['function'] == 'bpc':
            return blueprint['runs']
        elif blueprint['function'] == 'relic':
            return blueprint['quantity']
        
    @staticmethod
    def _build_process(process, batch):
        process = {**process, 'batch': batch}
        process['materials'] = [{
            **material,
            'usage': calc_mat_needs(
                material['quantity'],
                process['blueprint']['material_efficiency'],
                process['station_industry'].get('strEngMatBonus', 1),
                process['batch']['runs'],
                process['activity']['type']\
                    if material['type']['group']['category']['id'] != 9\
                    else None,
            )
        } for material in process['materials']]
        return process
