from .....tools.parsers import parse_type

def parse_invent_link(product_item, output_units):
    link = {
        'link_id': '{}-{}'.format(product_item.blueprint_id, product_item.type_id),
        'source': product_item.blueprint_id,
        'target': product_item.type_id,
        'material': {
            'type': parse_type(product_item.activity.blueprint.type),
            'quantity': 1,
        },
        'target_runs': output_units,
        'target_me': 0,
        'target_process': 'invention',
        'units': output_units,
    }
    return link
