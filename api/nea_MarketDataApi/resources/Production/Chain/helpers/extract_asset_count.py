from nea_schema.maria.esi.corp import CorpAsset

from .....tools.extractors import extract_parent_station
from .....tools.parsers import parse_type

def extract_asset_count(conn, type_id, station_ids):
    asset_items = conn.query(CorpAsset).filter_by(type_id=type_id)
    assets = [{
        'item_id': asset_item.item_id,
        'type': parse_type(asset_item.type),
        'parent_station': extract_parent_station(conn, asset_item.parent),
        'quantity': asset_item.quantity,
    } for asset_item in asset_items]
    asset_count = sum([
        asset['quantity'] for asset in assets
        if asset['parent_station']['station_id'] in station_ids
    ])
    return asset_count