from flask import request
import json

from nea_schema.maria.sde.bp import Product

from .helpers import SankeyConstructor
from ...Root import Root

class ProductionChain(Root):
    def get(self, type_id):
        req, data, errors = self._get_request()
        if len(errors) > 0:
            return self._build_response(req, {'errors': errors}, 400)
        
        type_id = int(type_id)
        output_units = int(req.parameters.query.get('output_units', 1))
        station_ids = json.loads(req.parameters.query.get('station_ids', '[]'))
        ignore_activity = json.loads(req.parameters.query.get('ignore_activity', '["reaction"]'))
        
        conn = self._maria_connect()
        nodes, links = SankeyConstructor(conn)\
            .construct_sankey_items(type_id, output_units, station_ids, ignore_activity)
        conn.close()
        
        return self._build_response(req, {'data': {'nodes': nodes, 'links': links}})
    
    
