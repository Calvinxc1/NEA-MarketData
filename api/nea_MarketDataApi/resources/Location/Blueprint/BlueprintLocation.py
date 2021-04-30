from flask import request
from nea_schema.maria.esi.corp import CorpAsset, CorpBlueprint

from ...Root import Root
from .helpers import blueprint_location_tally, construct_station_response, construct_location_response

class BlueprintLocation(Root):
    def get(self, location_id=None):
        location_ids = [int(location_id)] if location_id else []
        search = request.args['search'].strip().split(' ') if request.args.get('search') else []
        type_filter = request.args.get('type')
        
        conn = self._maria_connect()
        
        location_bp_counts = blueprint_location_tally(conn, location_ids, search, type_filter)
        
        blueprints, locations = construct_location_response(conn, location_bp_counts, location_ids, search, type_filter)\
            if location_ids else construct_station_response(conn, location_bp_counts)
            
        conn.close()
        
        return {'data': {'locations': locations, 'blueprints': blueprints}}, 200
