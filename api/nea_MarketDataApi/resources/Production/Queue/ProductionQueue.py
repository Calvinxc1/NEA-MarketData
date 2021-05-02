from ...Root import Root

class ProductionQueue(Root):        
    def post(self):
        req, data, errors = self._get_request()
        if len(errors) > 0:
            return self._build_response(req, {'errors': errors}, 400)
        
        return self._build_response(req, {})
