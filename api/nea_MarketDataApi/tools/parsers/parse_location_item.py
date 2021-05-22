from .parse_type_item import parse_type_item

def parse_location_item(asset_item):
    location = {
        'location_id': asset_item.item_id,
        'name': asset_item.item_name,
        'type': parse_type_item(asset_item.type),
        'parent': {
            'location_id': asset_item.location_id,
            'flag': asset_item.location_flag,
            'type': asset_item.location_type,
        },
    }
    return location
