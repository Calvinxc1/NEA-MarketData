from .parse_type_item import parse_type_item
from .parse_location_item import parse_location_item

def parse_station_item(station_item):
    station = {
        'station_id': station_item.station_id,
        'name': station_item.name.item_name,
        'type': parse_type_item(station_item.type),
        'system_id': station_item.planet.system_id,
        'owner_id': station_item.owner_id,
        'industry': {},
    }
    if station_item.office:
        station['office'] = parse_location_item(station_item.office)
        
    return station
