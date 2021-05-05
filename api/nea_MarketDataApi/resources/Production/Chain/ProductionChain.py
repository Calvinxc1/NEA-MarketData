from flask import request

from nea_schema.maria.sde.bp import Product

from .helpers import extract_available_materials, parse_chain_elements
from ...Root import Root

class ProductionChain(Root):
    def get(self, type_id):
        req, data, errors = self._get_request()
        if len(errors) > 0:
            return self._build_response(req, {'errors': errors}, 400)
        
        type_id = int(type_id)
        output_units = int(req.parameters.query.get('output_units', 1))
        station_ids = [int(station_id) for station_id in req.parameters.query['station_ids[]'].split(',')]\
            if req.parameters.query.get('station_ids[]') else []
        ignore_activity = req.parameters.query['ignore_activity[]'].split(',')\
            if req.parameters.query.get('ignore_activity[]') else ['reaction']
        
        conn = self._maria_connect()
        nodes, links = parse_chain_elements(conn, type_id, output_units, station_ids, ignore_activity)
        available_materials = extract_available_materials(conn, links, station_ids)
        conn.close()
        
        nodes = [node for node in nodes.values()]
        links = [
            {**link, 'available_quantity': available_materials.get(link['type']['id'], None)}
            for link in links.values()
        ]
        
        return self._build_response(req, {'data': {'nodes': nodes, 'links': links}})
    
    
