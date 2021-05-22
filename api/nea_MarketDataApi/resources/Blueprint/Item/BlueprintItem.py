from ...Root import Root
from .helpers import CorpBlueprintExtractor

class BlueprintItem(Root):        
    def get(self, item_id):
        req, data, errors = self._get_request()
        if len(errors) > 0:
            return self._build_response(req, {'errors': errors}, 400)
        
        item_id = int(req.parameters.path.get('item_id'))
        
        conn = self._maria_connect()
        blueprint = CorpBlueprintExtractor(conn, parent=self, endpoint=True)\
            .extract_corp_bp(item_id)
        conn.close()
        
        return self._build_response(req, {'data': blueprint})
