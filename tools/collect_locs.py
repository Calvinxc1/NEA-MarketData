import pandas as pd

from nea_schema.maria.esi.uni import Structure
from nea_schema.maria.esi.corp import CorpAsset
from nea_schema.maria.sde.map import Station

def collect_locs(loc_ids, conn):
    query = {
        'structures': conn.query(Structure).filter(Structure.structure_id.in_(loc_ids)),
        'assets': conn.query(CorpAsset).filter(CorpAsset.item_id.in_(loc_ids)),
        'stations': conn.query(Station).filter(Station.station_id.in_(loc_ids)),
    }
    
    structures = pd.DataFrame([{
        'loc_id': row.structure_id,
        'loc_name': row.structure_name,
        'parent_id': row.system_id,
        'parent_type': 'solar_system',
        'parent_flag': None,
    } for row in query['structures']])
    assets = pd.DataFrame([{
        'loc_id': row.item_id,
        'loc_name': row.item_name,
        'parent_id': row.location_id,
        'parent_type': row.location_type,
        'parent_flag': row.location_flag,
    } for row in query['assets']])
    stations = pd.DataFrame([{
        'loc_id': row.station_id,
        'loc_name': row.name.item_name,
        'parent_id': row.planet.system.system_id,
        'parent_type': 'solar_system',
        'parent_flag': None,
    } for row in query['stations']])
    
    locations = pd.concat([structures, assets, stations], axis=0)
    if len(locations) > 0:
        addit_ids = [int(val) for val in sorted(locations.loc[~locations['parent_id'].isin(locations['loc_id']), 'parent_id'].unique())]
        if len(addit_ids) > 0:
            new_locs = collect_locs(addit_ids, conn)
            locations = locations.append(new_locs)
    
    return locations