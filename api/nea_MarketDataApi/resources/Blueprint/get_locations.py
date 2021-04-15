from pandas import DataFrame, concat

from nea_schema.maria.esi.corp import CorpAsset
from nea_schema.maria.esi.uni import Structure
from nea_schema.maria.sde.map import Station

columns = ['id', 'name', 'type_id', 'type_name', 'location_id', 'location_flag', 'location_type', 'owner_id']

def get_locations(location_ids, conn):
    asset_query = conn.query(CorpAsset).filter(CorpAsset.item_id.in_(location_ids))
    loc_assets = DataFrame(({
        'id': row.item_id,
        'name': row.item_name,
        'type_id': row.type_id,
        'type_name': row.type.type_name,
        'location_id': row.location_id,
        'location_flag': row.location_flag,
        'location_type': row.location_type,
        'owner_id': None,
    } for row in asset_query), columns=columns).set_index('id')

    structure_query = conn.query(Structure).filter(Structure.structure_id.in_(location_ids))
    loc_structures = DataFrame(({
        'id': row.structure_id,
        'name': row.structure_name,
        'type_id': row.type_id,
        'type_name': row.type.type_name,
        'location_id': row.system_id,
        'location_flag': None,
        'location_type': 'system',
        'owner_id': row.owner_id,
    } for row in structure_query), columns=columns).set_index('id')

    station_query = conn.query(Station).filter(Station.station_id.in_(location_ids))
    loc_stations = DataFrame(({
        'id': row.station_id,
        'name': row.name.item_name,
        'type_id': row.type_id,
        'type_name': row.type.type_name,
        'location_id': row.planet.system_id,
        'location_flag': None,
        'location_type': 'system',
        'owner_id': row.owner_id,
    } for row in station_query), columns=columns).set_index('id')

    locations = concat([loc_assets, loc_structures, loc_stations], axis=0)

    return locations
