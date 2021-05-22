def parse_blueprint_item_function(blueprint_item):
    if blueprint_item.type.group.category_id == 9:
        if blueprint_item.quantity == -2: return 'bpc'
        else: return 'bp'
    elif blueprint_item.type.group.category_id == 34: return 'relic'
    elif blueprint_item.type.group.category_id == 24: return 'reaction'
