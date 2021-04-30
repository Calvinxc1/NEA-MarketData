from nea_schema.maria.esi.corp import CorpAsset

from .....tools.parsers import parse_location
from .....tools.extractors import extract_stations

def construct_station_response(conn, location_bp_counts):
    blueprints = []
    office_location_items = conn.query(CorpAsset).filter(CorpAsset.item_id.in_(location_bp_counts.keys()))
    offices = [parse_location(office_location_item) for office_location_item in office_location_items]
    station_ids = [office['parent']['location_id'] for office in offices]
    locations = [
        {
            **station,
            'office': {key:val for key, val in office.items() if key != 'parent'},
            'bp_counts': {
                'station': sum(location_bp_counts[office['location_id']].values()),
                'divisions': [{
                    'division': key,
                    'count': val,
                } for key, val in location_bp_counts[office['location_id']].items()],
            },
        } for station in extract_stations(conn, station_ids)
        for office in offices
        if office['parent']['location_id'] == station['station_id']
    ]
    return blueprints, locations