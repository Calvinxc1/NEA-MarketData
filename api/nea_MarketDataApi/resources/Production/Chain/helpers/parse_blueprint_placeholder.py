from .....tools.parsers import parse_blueprint_product
from .....tools.parsers import parse_type

def parse_blueprint_placeholder(product_item, invention=False):
    blueprint = {
        'item_id': product_item.blueprint_id,
        'type': parse_type(product_item.activity.blueprint.type),
        'material_efficiency': 2 if invention else 0,
        'time_efficiency': 4 if invention else 0,
        'quantity': 0,
        'runs': 0,
        'max_production_limit': product_item.activity.blueprint.max_production_limit,
        'bp_type': 'placeholder',
        'product': parse_blueprint_product(product_item),
    }
        
    return blueprint
