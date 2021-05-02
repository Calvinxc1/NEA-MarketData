from nea_schema.maria.esi.corp import CorpBlueprint

from .filter_blueprint_items import filter_blueprint_items
from .....tools.extractors import extract_asset_location

def blueprint_location_tally(conn, location_limits=[], search=[], type_filter=None):
    blueprint_items = conn.query(CorpBlueprint)
    blueprint_items = filter_blueprint_items(blueprint_items, search, type_filter)
        
    location_bp_counts = {}
    for blueprint_item in blueprint_items:
        location = extract_asset_location(blueprint_item.location, location_limits)
        
        if len(location_limits) > 0 and location.location_id not in location_limits: continue
        
        location_bp_counts[location.item_id] = location_bp_counts.get(location.item_id, {blueprint_item.location_flag: 0})
        location_bp_counts[location.item_id][blueprint_item.location_flag] = \
            location_bp_counts[location.item_id].get(blueprint_item.location_flag, 0) + 1
        
    return location_bp_counts
