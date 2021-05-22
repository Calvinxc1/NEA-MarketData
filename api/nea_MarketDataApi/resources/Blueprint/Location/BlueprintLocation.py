from flask import request
import json

from nea_schema.maria.esi.corp import CorpAsset, CorpBlueprint

from .helpers import BlueprintLocationParser, BlueprintStationParser
from ...Root import Root

class BlueprintLocation(Root):
    def get(self, location_id=None):
        req, data, errors = self._get_request()
        if len(errors) > 0:
            return self._build_response(req, {'errors': errors}, 400)
        
        search = req.parameters.query['search'].strip().split(' ')\
            if req.parameters.query.get('search') else []
        type_filter = req.parameters.query.get('type')
        station_ids = json.loads(req.parameters.query.get('station_ids', '[]'))
        
        conn = self._maria_connect()
        if location_id:
            location_ids = [int(location_id)]
            blueprints, locations = BlueprintLocationParser(conn, parent=self, endpoint=True)\
                .parse_location_bps(search, type_filter, station_ids, location_ids)
        else:
            blueprints, locations = BlueprintStationParser(conn, parent=self, endpoint=True)\
                .parse_station_bps(search, type_filter, station_ids)
        conn.close()
        
        return self._build_response(req, {'data': {'blueprints': blueprints, 'locations': locations}})
