from ...Root import Root

from ....tools.extractors import extract_blueprints_info

class BlueprintItem(Root):        
    def get(self, item_id):
        req, data, errors = self._get_request()
        if len(errors) > 0:
            return self._build_response(req, {'errors': errors}, 400)
        
        item_id = int(req.parameters.path.get('item_id'))
        
        conn = self._maria_connect()
        blueprint = extract_blueprints_info(conn, [item_id])[0]
        conn.close()
        
        return self._build_response(req, {'data': blueprint})
