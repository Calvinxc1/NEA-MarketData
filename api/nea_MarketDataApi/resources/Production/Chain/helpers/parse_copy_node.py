from .....tools.parsers import parse_type
from .select_blueprint import select_blueprint
from ...helpers import calc_prod_time

def parse_copy_node(activity_item, output_units, blueprint_items={'options': [], 'selected': {}}):
    node = {
        'node_id': activity_item.blueprint_id,
        'type': parse_type(activity_item.blueprint.type),
        'product': {
            'type':parse_type(activity_item.blueprint.type),
            'quantity': 1,
            'probability': 1,
        },
        'activity': {
            'type': activity_item.activity_type,
            'time': activity_item.time,
        },
        'output_units': output_units,
        'output_runs': output_units,
        'items': blueprint_items,
    }
    
    node['prod_time'] = calc_prod_time(activity_item.time, 0, output_units)
    
    return node