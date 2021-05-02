from .parse_type import parse_type

def parse_structure(structure_item):
    station = {
        'station_id': structure_item.structure_id,
        'name': structure_item.structure_name,
        'type': parse_type(structure_item.type),
        'system_id': structure_item.system_id,
        'location_type': 'system',
        'owner_id': structure_item.owner_id,
    }
    return station
