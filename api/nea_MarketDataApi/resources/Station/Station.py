from nea_schema.maria.esi.corp import CorpAsset
from ...tools.extractors import extract_stations

from ..Root import Root

class Station(Root):
    def get(self):
        req, data, errors = self._get_request()
        if len(errors) > 0:
            return self._build_response(req, {'errors': errors}, 400)
        
        conn = self._maria_connect()
        office_items = conn.query(CorpAsset).filter_by(type_id=27)
        station_ids = [office_item.location_id for office_item in office_items]
        stations = extract_stations(conn, station_ids)
        conn.close()
        
        return self._build_response(req, {'data': stations})
