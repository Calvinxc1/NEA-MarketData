from .....tools.parsers import parse_type

def parse_invent_bp_link(invent_product_item, node):
    invent_bp_link = {
        'link_id': '{}-{}'.format(node['type']['id'], node['node_id']),
        'source': node['type']['id'],
        'target': node['node_id'],
        'material': {
            'type': parse_type(invent_product_item.type),
            'quantity': 1,
        },
        'target_runs': node['output_runs'],
        'target_me': 0,
        'target_process': 'manufacturing',
        'units': node['output_runs'],
    }
    return invent_bp_link
