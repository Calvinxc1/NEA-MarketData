def sort_blueprints(blueprints, specified_blueprints=[]):
    blueprint_priority = [
        *sorted([
            blueprint for blueprint in blueprints
            if blueprint['item_id'] in specified_blueprints
        ], key=lambda x: x['efficency_ratio'], reverse=True),
        *sorted([
            blueprint for blueprint in blueprints
            if blueprint['item_id'] not in specified_blueprints
            and blueprint['bp_type'] != 'copy'
        ], key=lambda x: x['efficency_ratio'], reverse=True),
        *sorted([
            blueprint for blueprint in blueprints
            if blueprint['item_id'] not in specified_blueprints
            and blueprint['bp_type'] == 'copy'
        ], key=lambda x: x['efficency_ratio'], reverse=True),
    ]
    
    return blueprint_priority
