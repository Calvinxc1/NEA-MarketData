from flask import request
import json as js

from nea_schema.maria.sde.bp import Product

from ...Root import Root
from .extract_sankey_elements import extract_sankey_elements

class ProductionChain(Root):
    def get(self, type_id):
        req, data, errors = self._get_request()
        if len(errors) > 0:
            return self._build_response(req, {'errors': errors}, 400)
        
        type_id = int(type_id)
        output_units = int(req.parameters.query.get('output_units', 1))
        station_ids = [int(station_id) for station_id in req.parameters.query['station_ids[]'].split(',')]\
            if req.parameters.query.get('station_ids[]') else []
        bp_items = {
            int(key):val for key, val
            in js.loads(req.parameters.query.get('bp_items', '{}')).items()
        }
        ignore_activity = req.parameters.query['ignore_activity[]'].split(',')\
            if req.parameters.query.get('ignore_activity[]') else ['reaction']
        
        conn = self._maria_connect()
        product_items = conn.query(Product).filter(Product.type_id == type_id)
        nodes, links = extract_sankey_elements(conn, product_items, output_units, station_ids, bp_items, ignore_activity)
        conn.close()
        
        nodes = [node for node in nodes.values()]
        links = [link for link in links.values()]
        
        return self._build_response(req, {'data': {'nodes': nodes, 'links': links}})
    
    
