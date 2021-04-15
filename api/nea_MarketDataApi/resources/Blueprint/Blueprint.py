from flask_restful import Resource

from .collect_blueprints import collect_blueprints
from .collect_locations import collect_locations
from .parse_bp_locs import parse_bp_locs
from .collect_blueprint import collect_blueprint
from ...tools import build_maria_conn

class Blueprint(Resource):
    def __init__(self, logger, sql_params, verbose=False):
        self._logger = logger
        self._sql_params = sql_params
        self._verbose = verbose
        
    def get(self, item_id=None):
        data = self._get_item(item_id)\
            if item_id\
            else self._get_list()
        
        return {'data': data}, 200
    
    def _get_list(self):
        conn = build_maria_conn(self._sql_params)
        blueprints = collect_blueprints(conn)
        location_ids = [int(val) for val in blueprints['location_id'].unique()]
        locations = collect_locations(location_ids, conn)
        conn.close()
        
        system_locs = locations.loc[locations['location_type'] == 'system']
        bp_listing = parse_bp_locs(system_locs, locations, blueprints)
        return bp_listing
    
    def _get_item(self, item_id):
        conn = build_maria_conn(self._sql_params)
        blueprint = collect_blueprint(item_id, conn)
        conn.close()
        
        return blueprint
