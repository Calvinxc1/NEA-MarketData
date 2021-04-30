from .....tools.parsers import parse_type

def build_market_node(type_item, output_units):
    market_node = {
        'node_id': type_item.type_id,
        'type': {'id': -1, 'name': 'Market'},
        'product': {
            'type': parse_type(type_item),
            'quantity': 1,
            'probability': 1,
        },
        'activity': {'type': 'purchase', 'time': 0},
        'output_units': output_units,
        'output_runs': output_units,
        'items': {
            'options': {},
            'selected': -1,
        },
        'prod_time': 0,
    }
    return market_node
