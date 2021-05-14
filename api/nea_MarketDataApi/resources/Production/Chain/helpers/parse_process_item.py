from .calc_efficiency_ratio import calc_efficiency_ratio
from .....tools.parsers import parse_blueprint_item, parse_blueprint_product, parse_blueprint_material, parse_type

def parse_process_item(blueprint_item, product_item, parent_station, invented=False):
    process_item = {
        'blueprint': parse_blueprint_item(blueprint_item, include_activities=False),
        'product': parse_blueprint_product(product_item),
        'efficiency_ratio': calc_efficiency_ratio(
            blueprint_item.material_efficiency, product_item.quantity, product_item.probability
        ),
        'activity': {
            'type': product_item.activity.activity_type,
            'time': product_item.activity.time,
        },
        'materials': [
            parse_blueprint_material(material_item)
            for material_item in product_item.activity.material
        ],
        'station_industry': parent_station['industry'],
    }
    
    if invented:
        process_item['materials'].append({
            'type': parse_type(blueprint_item.type),
            'quantity': 1,
        })
        
    if process_item['activity']['type'] == 'invention':
        process_item['materials'].append({
            'type': parse_type(blueprint_item.type),
            'quantity': 1,
        })
    
    return process_item
