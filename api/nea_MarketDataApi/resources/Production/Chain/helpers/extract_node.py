from numpy import inf

from nea_schema.maria.sde.bp import Activity, Product
from nea_schema.maria.sde.inv import Type

from .extract_market_process import extract_market_process
from .extract_processes import extract_processes
from ...helpers import calc_invent_chance, calc_mat_needs, calc_prod_time
from .....tools.parsers import parse_type, parse_blueprint_material

class CopyProduct:
    def __init__(self, activity_item):
        self.blueprint_id = activity_item.blueprint_id
        self.activity = activity_item
        self.quantity = 1
        self.probability = 1
        self.type = activity_item.blueprint.type

def extract_node(conn, type_id, output_units, station_ids, ignore_activity):
    node = {
        'node_id': type_id,
        'output_units': output_units,
        'type': parse_type(conn.query(Type).filter_by(type_id=type_id).one()),
        'process': [],
        'process_options': [],
        'materials': {},
    }
    
    product_items = conn.query(Product).filter_by(type_id=type_id)\
        .filter(Product.activity_type.notin_(ignore_activity))
    
    if product_items.count() == 0:
        copy_activity_items = conn.query(Activity).filter_by(activity_type='copying', blueprint_id=type_id)
        product_items = [CopyProduct(activity_item) for activity_item in copy_activity_items]
        if len(product_items) == 0:    
            process = extract_market_process(conn, type_id, output_units)
            node['process'].append(process)
            node['process_options'].append(process)
            node['materials'] = []
            return node
    
    node['process_options'] = extract_processes(conn, product_items, station_ids)
    
    remaining_units = output_units
    for process in node['process_options']:
        if process['blueprint']['bp_type'] in ['original', 'placeholder']:
            remaining_runs = inf
        elif process['blueprint']['bp_type'] == 'copy':
            remaining_runs = process['blueprint']['runs']
        elif process['blueprint']['bp_type'] == 'relic':
            remaining_runs = process['blueprint']['quantity']
            
        chance = min(1, calc_invent_chance(process['product']['probability']))
        units_per_run = process['product']['quantity'] * chance
        max_units_per_batch = process['blueprint']['max_production_limit'] * units_per_run\
            if process['blueprint']['bp_type'] != 'original'\
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
            
            process = {
                **process,
                'batch': {
                    'runs': batch_runs,
                    'chance': chance,
                    'units': batch_units,
                    'seconds': batch_seconds,
                },
            }
            
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
            
            node['process'].append(process)
            
            for material in process['materials']:
                node['materials'][material['type']['id']] = node['materials']\
                    .get(material['type']['id'], 0) + material['usage']
            
            remaining_units -= batch_units
            remaining_runs -= batch_runs
            if remaining_units <= 0: break
        if remaining_units <= 0: break
    
    node['materials'] = [
        {'type_id': key, 'quantity': val}
        for key, val in node['materials'].items()
    ]
            
    return node
