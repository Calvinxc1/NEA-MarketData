def select_blueprint(blueprints, bp_item_id=None):
    selection_list = [
        blueprint for blueprint in blueprints
        if blueprint['item_id'] == bp_item_id
    ]
    
    if len(selection_list) == 0:
        selection_list = sorted([
            blueprint for blueprint in blueprints
            if blueprint['bp_type'] not in ['copy', 'placeholder']
        ], key=lambda x: x['efficency_ratio'], reverse=True)

    if len(selection_list) == 0:
        selection_list = sorted([
            blueprint for blueprint in blueprints
            if blueprint['bp_type'] == 'copy'
        ], key=lambda x: x['efficency_ratio'], reverse=True)

    if len(selection_list) == 0:
        selection_list = sorted([
            blueprint for blueprint in blueprints
            if blueprint['bp_type'] == 'placeholder'
        ], key=lambda x: x['efficency_ratio'], reverse=True)
        
    selection = selection_list[0] if selection_list else None
    return selection
