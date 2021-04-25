from nea_schema.maria.sde.inv import Type, Group
from nea_schema.maria.esi.corp import CorpBlueprint

def filter_blueprint_items(blueprint_items, search, type_filter):
    if len(search) > 0 or type_filter == 'relic':
        blueprint_items = blueprint_items.join(Type)

    for search_term in search:
        blueprint_items = blueprint_items.filter(Type.type_name.contains(search_term))
        
    if type_filter == 'original':
        print(type_filter)
        blueprint_items = blueprint_items.filter(CorpBlueprint.quantity == -1)
    elif type_filter == 'copy':
        print(type_filter)
        blueprint_items = blueprint_items.filter(CorpBlueprint.quantity == -2)
    elif type_filter == 'relic':
        print(type_filter)
        blueprint_items = blueprint_items.join(Group).filter(Group.category_id == 34)
        
    return blueprint_items
