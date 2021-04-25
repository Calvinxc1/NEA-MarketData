from .extract_stations import extract_stations

def extract_parent_station(conn, location_item):
    parser = location_item
    if location_item.parent:
        parser = extract_parent_station(conn, parser.parent)
    else:
        parser = extract_stations(conn, [location_item.location_id])[0]
    return parser
