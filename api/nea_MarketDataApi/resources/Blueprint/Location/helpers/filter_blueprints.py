from nea_schema.maria.esi.corp import CorpBlueprint
from nea_schema.maria.sde.inv import Type, Group

def filter_blueprints(blueprint_query, search=[], type_filter=None):
    blueprint_query = blueprint_query.join(Type).join(Group)

    for search_term in search:
        blueprint_query = blueprint_query.filter(Type.type_name.contains(search_term))
        
    if type_filter == 'bp':
        blueprint_query = blueprint_query.filter(
            CorpBlueprint.quantity != -2,
            Group.category_id == 9,
        )
    elif type_filter == 'bpc':
        blueprint_query = blueprint_query.filter(
            CorpBlueprint.quantity == -2,
            Group.category_id == 9,
        )
    elif type_filter == 'relic':
        blueprint_query = blueprint_query.filter(Group.category_id == 34)
    elif type_filter == 'reaction':
        blueprint_query = blueprint_query.filter(Group.category_id == 24)

    return blueprint_query
