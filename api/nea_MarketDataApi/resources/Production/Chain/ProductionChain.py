from flask import request
import json

from nea_schema.maria.sde.bp import Product

from .helpers import build_chain_elements, extract_available_materials
from ...Root import Root

class ProductionChain(Root):
    def get(self, type_id):
        req, data, errors = self._get_request()
        if len(errors) > 0:
            return self._build_response(req, {'errors': errors}, 400)
        
        type_id = int(type_id)
        output_units = int(req.parameters.query.get('output_units', 1))
        station_ids = json.loads(req.parameters.query.get('station_ids', '[]'))
        ignore_activity = json.loads(req.parameters.query.get('ignore_activity', '[]'))
        
        conn = self._maria_connect()
        nodes, links = build_chain_elements(conn, type_id, output_units, station_ids, ignore_activity)
        available_materials = extract_available_materials(conn, links, station_ids)
        conn.close()
        
        nodes = [node for node in nodes.values()]
        links = [
            {**link, 'available_quantity': available_materials.get(link['type']['id'], None)}
            for link in links.values()
        ]
        
        return self._build_response(req, {'data': {'nodes': nodes, 'links': links}})
    
    
