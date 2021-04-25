from nea_schema.maria.esi.corp import CorpBlueprint

from ..parsers import parse_blueprint
from .extract_parent_station import extract_parent_station

def extract_blueprints_info(conn, blueprint_item_ids=[]):
    blueprint_items = conn.query(CorpBlueprint).filter(CorpBlueprint.item_id.in_(blueprint_item_ids))
    blueprints = [
        {
            **parse_blueprint(blueprint_item),
            'parent_station': extract_parent_station(conn, blueprint_item.location),
        } for blueprint_item in blueprint_items
    ]
    return blueprints
