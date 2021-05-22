from .parse_type_item import parse_type_item
from .parse_location_item import parse_location_item

def parse_structure_item(structure_item):
    station = {
        'station_id': structure_item.structure_id,
        'name': structure_item.structure_name,
        'type': parse_type_item(structure_item.type),
        'system_id': structure_item.system_id,
        'owner_id': structure_item.owner_id,
        'industry': {
            type_attribute.attribute.name:type_attribute.value
            for type_attribute in structure_item.type.type_attribute
            if type_attribute.attribute_id in [2600, 2601, 2602]
        },
    }
    if structure_item.office:
        station['office'] = parse_location_item(structure_item.office)
        
    return station
