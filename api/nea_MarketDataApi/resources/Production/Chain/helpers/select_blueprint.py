def select_blueprint(blueprints):
    if len(blueprints) == 0: return -1
    
    bp_originals = [
        blueprint for blueprint in blueprints
        if blueprint['bp_type'] == 'original'
    ]
    
    blueprint_selections = blueprints if len(bp_originals) == 0 else bp_originals
    blueprint_selection = sorted(blueprints, key=lambda x: x['material_efficiency'], reverse=True)[0]['item_id']
    return blueprint_selection
