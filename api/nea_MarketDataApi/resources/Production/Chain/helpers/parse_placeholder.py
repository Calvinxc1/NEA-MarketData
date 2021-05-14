from .calc_efficiency_ratio import calc_efficiency_ratio
from .....tools.parsers import parse_blueprint_product, parse_blueprint_material, parse_type

def parse_placeholder(product_item, invented=False):
    placeholder = {
        'blueprint': {
            'item_id': product_item.blueprint_id,
            'type': parse_type(product_item.activity.blueprint.type),
            'material_efficiency': 2 if invented else 0,
            'time_efficiency': 4 if invented else 0,
            'quantity': 0,
            'runs': -1,
            'max_production_limit': product_item.activity.blueprint.max_production_limit,
            'bp_type': 'placeholder',
        },
        'product': parse_blueprint_product(product_item),
        'efficiency_ratio': calc_efficiency_ratio(0, product_item.quantity, product_item.probability),
        'activity': {
            'type': product_item.activity.activity_type,
            'time': product_item.activity.time,
        },
        'materials': [
            parse_blueprint_material(material_item)
            for material_item in product_item.activity.material
        ],
        'station_industry': {},
    }
    
    if invented:
        placeholder['materials'].append({
            'type': parse_type(product_item.activity.blueprint.type),
            'quantity': 1,
        })
        
    if product_item.activity.activity_type == 'invention':
        placeholder['materials'].append({
            'type': parse_type(product_item.activity.blueprint.type),
            'quantity': 1,
        })
    
    return placeholder
