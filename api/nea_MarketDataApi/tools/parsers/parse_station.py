from .parse_type import parse_type

def parse_station(station_item):
    station = {
        'station_id': station_item.station_id,
        'name': station_item.name.item_name,
        'type': parse_type(station_item.type),
        'system_id': station_item.planet.system_id,
        'location_type': 'system',
        'owner_id': station_item.owner_id,
        'industry': {},
    }
    return station
