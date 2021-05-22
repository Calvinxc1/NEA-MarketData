from .parse_blueprint_activity_item import parse_blueprint_activity_item
from .parse_blueprint_item_function import parse_blueprint_item_function
from .parse_type_item import parse_type_item

prohibited_activities = {
    'bp': ['invention'],
    'bpc': ['research_material', 'research_time', 'copying']
}

def parse_corp_blueprint_item(blueprint_item, activities=False):
    blueprint = {
        'item_id': blueprint_item.item_id,
        'type': parse_type_item(blueprint_item.type),
        'function': parse_blueprint_item_function(blueprint_item),
        'location': {
            'flag': blueprint_item.location_flag,
            'location_id': blueprint_item.location_id,
        },
        'material_efficiency': blueprint_item.material_efficiency,
        'time_efficiency': blueprint_item.time_efficiency,
        'quantity': max(0, blueprint_item.quantity),
        'runs': max(0, blueprint_item.runs),
        'max_production_limit': blueprint_item.blueprint.max_production_limit,
    }
    
    if activities:
        blueprint['activities'] = [
            parse_blueprint_activity_item(activity_item)
            for activity_item in blueprint_item.blueprint.activity
            if activity_item.activity_type not in prohibited_activities.get(blueprint['function'], [])
        ]
    
    return blueprint
