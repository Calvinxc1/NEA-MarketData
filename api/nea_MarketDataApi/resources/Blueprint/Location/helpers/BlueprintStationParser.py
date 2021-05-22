from sqlalchemy import func

from nea_schema.maria.esi.corp import CorpAsset, CorpBlueprint, CorpIndustry

from . import LoggingBase, extract_stations
from .filter_blueprints import filter_blueprints

class BlueprintStationParser(LoggingBase):
    def __init__(self, conn, parent=None, endpoint=False):
        self._init_logging(parent, endpoint)
        self._conn = conn
    
    def parse_station_bps(self, search=[], type_filter=None, station_ids=[]):
        station_bp_counts = self._extract_station_bp_counts(search, type_filter, station_ids)

        locations = [{
            **station,
            'blueprint_count': station_bp_counts[station['station_id']],
        } for station in extract_stations(self._conn, station_bp_counts.keys())]

        return [], locations
    
    def _extract_station_bp_counts(self, search, type_filter, station_ids):
        blueprint_query = filter_blueprints(self._conn.query(CorpBlueprint.item_id), search, type_filter)
        
        asset_bp_query = self._conn.query(CorpAsset.station_id, func.count()).group_by(CorpAsset.station_id)\
            .filter(CorpAsset.item_id.in_(blueprint_query))
        if station_ids: asset_bp_query = asset_bp_query.filter(CorpAsset.station_id.in_(station_ids))
        station_bp_counts = {station_id:count for station_id, count in asset_bp_query}

        industry_bp_query = self._conn.query(CorpIndustry.location_id, func.count())\
            .filter(
                CorpIndustry.blueprint_id.in_(blueprint_query),
                CorpIndustry.status.in_(['active', 'paused', 'ready']),
            ).group_by(CorpIndustry.location_id)
        if station_ids: industry_bp_query = industry_bp_query.filter(CorpIndustry.location_id.in_(station_ids))
        industry_station_bp_counts = {station_id:count for station_id, count in industry_bp_query}

        for key, val in industry_station_bp_counts.items():
            station_bp_counts[key] = station_bp_counts.get(key, 0) + val
            
        return station_bp_counts
