from nea_schema.maria.esi.uni import Structure
from nea_schema.maria.sde.map import Station

from ..parsers import parse_station, parse_structure

def extract_stations(conn, location_ids):
    station_items = conn.query(Station).filter(Station.station_id.in_(location_ids))
    stations = [parse_station(station_item) for station_item in station_items]
    
    structure_items = conn.query(Structure).filter(Structure.structure_id.in_(location_ids))
    structures = [parse_structure(structure_item) for structure_item in structure_items]
    
    stations.extend(structures)
    return stations
