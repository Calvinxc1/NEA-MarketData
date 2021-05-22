from numpy import inf

from nea_schema.maria.esi.corp import CorpBlueprint
from nea_schema.maria.sde.bp import Product

from . import LoggingBase, extract_parent_station, parse_corp_blueprint_item, \
    parse_blueprint_product_item, parse_blueprint_material_item, parse_type_item

class ProcessExtractor(LoggingBase):
    def __init__(self, conn, parent=None, endpoint=False):
        self._init_logging(parent, endpoint)
        self._conn = conn
        
    def extract_processes(self, product_items, station_ids=[]):
        processes = []
        for product_item in product_items:
            blueprint_items = self._conn.query(CorpBlueprint).filter_by(type_id=product_item.blueprint_id)
            for blueprint_item in blueprint_items:
                parent_station = extract_parent_station(self._conn, blueprint_item.location)

                if parent_station['station_id'] not in station_ids:
                    continue
                if product_item.activity.activity_type == 'copying'\
                    and blueprint_item.quantity != -1:
                    continue
                if product_item.activity.activity_type == 'invention'\
                    and (blueprint_item.quantity != -2 and blueprint_item.type.group.category.category_id != 34):
                    continue

                invented = self._conn.query(Product).filter_by(type_id=blueprint_item.type_id).count() > 0
                process = self._parse_process_item(blueprint_item, product_item, parent_station, invented)
                processes.append(process)

        processes = self._order_processes(processes)
        processes = [*processes, self._extract_placeholder(product_items)]
        return processes
    
    def _parse_process_item(self, blueprint_item, product_item, parent_station, invented=False):
        process_item = {
            'blueprint': parse_corp_blueprint_item(blueprint_item, activities=False),
            'product': parse_blueprint_product_item(product_item),
            'efficiency_ratio': self._calc_efficiency_ratio(
                blueprint_item.material_efficiency, product_item.quantity, product_item.probability
            ),
            'activity': {
                'type': product_item.activity.activity_type,
                'time': product_item.activity.time,
            },
            'materials': [
                parse_blueprint_material_item(material_item)
                for material_item in product_item.activity.material
            ],
            'station_industry': parent_station['industry'],
        }

        if invented:
            process_item['materials'].append({
                'type': parse_type_item(blueprint_item.type),
                'quantity': 1,
            })

        if process_item['activity']['type'] == 'invention':
            process_item['materials'].append({
                'type': parse_type_item(blueprint_item.type),
                'quantity': 1,
            })

        return process_item
    
    @staticmethod
    def _calc_efficiency_ratio(me_level, quantity, probability):
        return (quantity * probability) / (100 - me_level)
    
    @staticmethod
    def _order_processes(processes):
        processes = [
            *sorted([process for process in processes
             if process['blueprint']['function'] in ['bp', 'relic', 'reaction']],
                   key=lambda x: x['efficiency_ratio'], reverse=True),
            *sorted([process for process in processes
             if process['blueprint']['function'] not in ['bp', 'relic', 'reaction']],
                   key=lambda x: x['efficiency_ratio'], reverse=True),
        ]
        return processes
    
    def _extract_placeholder(self, product_items, invented=False):
        placeholder = {}
        for product_item in product_items:
            invented = self._conn.query(Product).filter_by(type_id=product_item.blueprint_id).count() > 0
            new_placeholder = self._parse_placeholder(product_item, invented)
            if new_placeholder['efficiency_ratio'] > placeholder.get('efficiency_ratio', -inf):
                placeholder = new_placeholder

        return placeholder
    
    def _parse_placeholder(self, product_item, invented=False):
        placeholder = {
            'blueprint': {
                'item_id': product_item.blueprint_id,
                'type': parse_type_item(product_item.activity.blueprint.type),
                'material_efficiency': 2 if invented else 0,
                'time_efficiency': 4 if invented else 0,
                'quantity': 0,
                'runs': -1,
                'max_production_limit': product_item.activity.blueprint.max_production_limit,
                'function': 'placeholder',
            },
            'product': parse_blueprint_product_item(product_item),
            'efficiency_ratio': self._calc_efficiency_ratio(0, product_item.quantity, product_item.probability),
            'activity': {
                'type': product_item.activity.activity_type,
                'time': product_item.activity.time,
            },
            'materials': [
                parse_blueprint_material_item(material_item)
                for material_item in product_item.activity.material
            ],
            'station_industry': {},
        }

        if invented:
            placeholder['materials'].append({
                'type': parse_type_item(product_item.activity.blueprint.type),
                'quantity': 1,
            })

        if product_item.activity.activity_type == 'invention':
            placeholder['materials'].append({
                'type': parse_type_item(product_item.activity.blueprint.type),
                'quantity': 1,
            })

        return placeholder
