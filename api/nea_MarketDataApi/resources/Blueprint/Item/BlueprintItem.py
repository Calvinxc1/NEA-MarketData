from ...Root import Root

from ....tools.extractors import extract_blueprints_info

class BlueprintItem(Root):        
    def get(self, item_id):
        item_id = int(item_id)
        
        conn = self._maria_connect()
        blueprint = extract_blueprints_info(conn, [item_id])[0]
        conn.close()
        
        return {'data': blueprint}, 200
