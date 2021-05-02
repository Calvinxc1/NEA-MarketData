from .....tools.parsers import parse_blueprint_product, parse_type
from .select_blueprint import select_blueprint
from ...helpers import calc_prod_time

def parse_node(product_item, output_units=1, blueprint_items={'options': [], 'selected': {}}):
    node = {
        'node_id': product_item.type_id,
        'type': parse_type(product_item.activity.blueprint.type),
        'product': parse_blueprint_product(product_item),
        'activity': {
            'type': product_item.activity.activity_type,
            'time': product_item.activity.time,
        },
        'output_units': output_units,
        'output_runs': output_units / (product_item.quantity * product_item.probability),
        'items': blueprint_items,
    }
    
    node['prod_time'] = calc_prod_time(
        product_item.activity.time,
        node['items']['selected'].get('time_efficiency', 0),
        node['output_runs'],
    )
    
    return node
