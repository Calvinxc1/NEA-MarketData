from nea_schema.maria.esi.corp import CorpAsset, CorpBlueprint
from nea_schema.maria.sde.inv import Type

from .filter_blueprint_items import filter_blueprint_items
from ....tools.parsers import parse_location, parse_blueprint

def construct_location_response(conn, location_bp_counts, location_ids, search=[], type_filter=None):
    blueprint_items = conn.query(CorpBlueprint).filter(CorpBlueprint.location_id.in_(location_ids))
    blueprint_items = filter_blueprint_items(blueprint_items, search, type_filter)
    blueprints = [parse_blueprint(blueprint_item) for blueprint_item in blueprint_items]

    location_items = conn.query(CorpAsset).filter(CorpAsset.item_id.in_(location_bp_counts.keys()))
    locations = [
        {
            **parse_location(location_item),
            'bp_count': sum(location_bp_counts[location_item.item_id].values()),
        } for location_item in location_items
    ]
    
    return blueprints, locations