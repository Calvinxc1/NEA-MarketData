from flask import request

from nea_schema.maria.sde.bp import Product

from ...Root import Root
from .helpers import extract_sankey_elements

class ProductionChain(Root):
    def get(self, type_id):
        type_id = int(type_id)
        output_units = int(request.args.get('output_units', 1))
        station_ids = [int(station_id) for station_id in request.args['station_ids'].split(',')]\
            if request.args.get('station_ids') else []
        ignore_activity = request.args['ignore_activity'].split(',')\
            if request.args.get('ignore_activity') else ['reaction']
        
        conn = self._maria_connect()
        product_item = conn.query(Product).filter(Product.type_id == type_id).one_or_none()
        nodes, links = extract_sankey_elements(conn, product_item, output_units, station_ids, ignore_activity)
        conn.close()
        
        nodes = [node for node in nodes.values()]
        links = [link for link in links.values()]
        
        return {'data': {'nodes': nodes, 'links': links}}, 200
