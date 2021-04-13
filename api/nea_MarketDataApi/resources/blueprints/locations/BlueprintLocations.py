from flask import request, make_response
from flask_restful import Resource

from .collect_blueprints import collect_blueprints
from .collect_locations import collect_locations
from .parse_bp_locs import parse_bp_locs
from ....tools import build_maria_conn

class BlueprintLocations(Resource):
    def __init__(self, sql_params, verbose=False):
        self._sql_params = sql_params
        self._verbose = verbose
        
    def get(self):
        conn = build_maria_conn(self._sql_params)
        blueprints = collect_blueprints(conn)
        
        location_ids = [float(val) for val in blueprints['location_id'].unique()]
        locations = collect_locations(location_ids, conn)
        while len(location_ids) > 0:
            location_mask = ~locations['location_id'].isin(locations.index)\
                & ~locations['location_type'].isin(['system'])
            
            location_ids = [
                int(val) for val
                in locations.loc[location_mask, 'location_id']
            ]
            
            locations = locations.append(collect_locations(location_ids, conn))
        
        conn.close()
        
        system_locs = locations.loc[locations['location_type'].isin(['system'])]
        bp_locs = parse_bp_locs(system_locs, locations, blueprints)
        return {'data': bp_locs}, 200
