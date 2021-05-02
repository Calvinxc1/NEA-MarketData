from flask import request
from nea_schema.maria.esi.corp import CorpAsset, CorpBlueprint

from ...Root import Root
from .helpers import blueprint_location_tally, construct_station_response, construct_location_response

class BlueprintLocation(Root):
    def get(self, location_id=None):
        req, data, errors = self._get_request()
        if len(errors) > 0:
            return self._build_response(req, {'errors': errors}, 400)
        
        location_ids = [int(req.parameters.path['location_id'])]\
            if req.parameters.path.get('location_id') else []
        search = req.parameters.query['search'].strip().split(' ')\
            if req.parameters.query.get('search') else []
        type_filter = req.parameters.query.get('type')
        
        conn = self._maria_connect()
        location_bp_counts = blueprint_location_tally(conn, location_ids, search, type_filter)
        if location_ids:
            blueprints, locations = construct_location_response(conn, location_bp_counts, location_ids, search, type_filter)
            conn.close()
            return self._build_response(req, {'data': {'blueprints': blueprints, 'locations': locations}})
        else:
            locations = construct_station_response(conn, location_bp_counts)
            conn.close()
            return self._build_response(req, {'data': locations})
