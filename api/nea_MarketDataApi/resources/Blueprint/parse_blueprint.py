from .parse_activity import parse_activity

def parse_blueprint(bp_item):
    blueprint = {
        'item_id': bp_item.item_id,
        'type_id': bp_item.type_id,
        'type_name': bp_item.type.type_name,
        'category_id': bp_item.type.group.category_id,
        'location_id': bp_item.location_id,
        'location_flag': bp_item.location_flag,
        'material_efficiency': bp_item.material_efficiency,
        'time_efficiency': bp_item.time_efficiency,
        'quantity': bp_item.quantity,
        'runs': bp_item.runs,
        'max_production_limit': bp_item.bp.max_production_limit,
        'activities': [
            parse_activity(activity)
            for activity in bp_item.bp.activity
        ],
    }

    if blueprint['quantity'] == -2: blueprint['bp_type'] = 'copy'
    elif blueprint['category_id'] == 34: blueprint['bp_type'] = 'relic'
    else: blueprint['bp_type'] = 'original'
        
    blueprint['quantity'] = max(blueprint['quantity'], 0)
        
    return blueprint
