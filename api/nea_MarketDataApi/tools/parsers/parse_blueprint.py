from .parse_blueprint_activity import parse_blueprint_activity
from .parse_location import parse_location
from .parse_type import parse_type

def parse_blueprint(blueprint_item):
    blueprint = {
        'item_id': blueprint_item.item_id,
        'type': parse_type(blueprint_item.type),
        'location': {
            **parse_location(blueprint_item.location),
            'flag': blueprint_item.location_flag,
        },
        'material_efficiency': blueprint_item.material_efficiency,
        'time_efficiency': blueprint_item.time_efficiency,
        'quantity': max(0, blueprint_item.quantity),
        'runs': max(0, blueprint_item.runs),
        'max_production_limit': blueprint_item.blueprint.max_production_limit,
        'activities': [
            parse_blueprint_activity(activity)
            for activity in blueprint_item.blueprint.activity
        ],
    }

    if blueprint_item.quantity == -2: blueprint['bp_type'] = 'copy'
    elif blueprint_item.type.group.category.category_id == 34: blueprint['bp_type'] = 'relic'
    else: blueprint['bp_type'] = 'original'
        
    return blueprint
