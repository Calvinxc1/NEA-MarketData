from nea_schema.maria.sde.bp import Product

from .calc_efficiency_ratio import calc_efficiency_ratio
from .....tools.parsers import parse_blueprint_product, parse_type

def parse_placeholder(product_items, invention=False):
    placeholder = sorted([{
        'blueprint': {
            'item_id': product_item.blueprint_id,
            'type': parse_type(product_item.activity.blueprint.type),
            'material_efficiency': 2 if invention else 0,
            'time_efficiency': 4 if invention else 0,
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
        'material_items': product_item.activity.material,
        'station_industry': {},
    } for product_item in product_items], key=lambda x: x['efficiency_ratio'], reverse=True)[0]
    return placeholder
