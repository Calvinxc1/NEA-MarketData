from ...Root import Root

class MarketOrders(Root):    
    def get(self, queue_id=None):
        req, data, errors = self._get_request()
        if len(errors) > 0:
            return self._build_response(req, {'errors': errors}, 400)

        station_ids = json.loads(req.parameters.query.get('station_ids', '[]'))

        self._init_mongo()
        data = self._get_specific(queue_id) if queue_id\
            else self._get_list(station_ids)
            
        return self._build_response(req, {'data': data})
