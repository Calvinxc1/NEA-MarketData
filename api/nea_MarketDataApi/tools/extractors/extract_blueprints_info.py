from nea_schema.maria.esi.corp import CorpBlueprint

from ..parsers import parse_blueprint_item
from .extract_parent_station import extract_parent_station

def extract_blueprints_info(conn, blueprint_item_ids=[], include_activities=True):
    blueprint_items = conn.query(CorpBlueprint).filter(CorpBlueprint.item_id.in_(blueprint_item_ids))
    blueprints = [
        {
            **parse_blueprint_item(blueprint_item, include_activities),
            'parent_station': extract_parent_station(conn, blueprint_item.location),
        } for blueprint_item in blueprint_items
    ]
    return blueprints
