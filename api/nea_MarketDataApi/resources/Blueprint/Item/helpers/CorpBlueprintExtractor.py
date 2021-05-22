from nea_schema.maria.esi.corp import CorpBlueprint

from . import LoggingBase, extract_stations, parse_corp_blueprint_item

class CorpBlueprintExtractor(LoggingBase):
    def __init__(self, conn, parent=None, endpoint=False):
        self._init_logging(parent, endpoint)
        self._conn = conn
        
    def extract_corp_bp(self, item_id):
        blueprint_item = self._conn.query(CorpBlueprint).filter_by(item_id=item_id).one_or_none()
        blueprint = {
            **parse_corp_blueprint_item(blueprint_item, activities=True),
            'station': extract_stations(self._conn, [blueprint_item.location.station_id])[0],
        }
        return blueprint
