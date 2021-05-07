from .....tools.parsers import parse_blueprint_item, parse_type

def parse_copy_placeholder(activity_item):
    placeholder = {
        'blueprint': {
            'item_id': activity_item.blueprint_id,
            'type': parse_type(activity_item.blueprint.type),
            'material_efficiency': 0,
            'time_efficiency': 0,
            'quantity': 0,
            'runs': -1,
            'max_production_limit': activity_item.blueprint.max_production_limit,
            'bp_type': 'placeholder',
        },
        'product': {
            'type': parse_type(activity_item.blueprint.type),
            'quantity': 1,
            'probability': 1.0,
        },
        'efficiency_ratio': 0,
        'activity': {
            'type': activity_item.activity_type,
            'time': activity_item.time,
        },
        'material_items': activity_item.material,
        'station_industry': {},
    }
    return placeholder
