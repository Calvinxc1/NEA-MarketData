from itertools import groupby
from sqlalchemy import func, and_, or_

from nea_schema.maria.esi.corp import CorpAsset, CorpBlueprint, CorpIndustry

from . import LoggingBase, parse_corp_blueprint_item, parse_location_item
from .filter_blueprints import filter_blueprints

class BlueprintLocationParser(LoggingBase):
    def __init__(self, conn, parent=None, endpoint=False):
        self._init_logging(parent, endpoint)
        self._conn = conn
        
    def parse_location_bps(self, search=[], type_filter=None, station_ids=[], location_ids=[]):
        blueprints = self._extract_blueprints(search, type_filter, station_ids, location_ids)
        locations = self._extract_locations(search, type_filter, station_ids, location_ids)
        return blueprints, locations
        
    def _extract_blueprints(self, search, type_filter, station_ids, location_ids):
        blueprint_query = filter_blueprints(self._conn.query(CorpBlueprint), search, type_filter)
        asset_bp_query = blueprint_query.join(CorpAsset, CorpBlueprint.item_id == CorpAsset.item_id)
        if station_ids: asset_bp_query = asset_bp_query.filter(CorpAsset.station_id.in_(station_ids))
        asset_bp_items = asset_bp_query.filter(CorpAsset.location_id.in_(location_ids))

        industry_bp_query = blueprint_query.join(CorpIndustry, CorpBlueprint.item_id == CorpIndustry.blueprint_id)\
            .filter(CorpIndustry.status.in_(['active', 'paused', 'ready']))
        if station_ids: industry_bp_query = industry_bp_query.filter(CorpIndustry.location_id.in_(station_ids))
        industry_bp_items = industry_bp_query.filter(CorpBlueprint.location_id.in_(location_ids))
        
        blueprints = [
            *[{
                **parse_corp_blueprint_item(blueprint_item),
            } for blueprint_item in asset_bp_items],
            *[{
                **parse_corp_blueprint_item(blueprint_item),
            } for blueprint_item in industry_bp_items],
        ]
        
        return blueprints
    
    def _extract_locations(self, search, type_filter, station_ids, location_ids):
        bp_loc_query = filter_blueprints(self._conn.query(CorpBlueprint.location_id, func.count()), search, type_filter)\
            .outerjoin(CorpAsset, and_(
                CorpBlueprint.item_id == CorpAsset.item_id,
                CorpAsset.station_id.in_(station_ids),
            )).outerjoin(CorpIndustry, and_(
                CorpBlueprint.item_id == CorpIndustry.blueprint_id,
                CorpIndustry.status.in_(['active', 'paused', 'ready']),
                CorpIndustry.location_id.in_(station_ids),
            )).filter(
                CorpBlueprint.location_id.notin_(location_ids),
                or_(CorpAsset.item_id != None, CorpIndustry.blueprint_id != None),
            ).group_by(CorpBlueprint.location_id)
        
        bp_loc_counts = {location_id: bp_count for location_id, bp_count in bp_loc_query}
        sub_locations = self._parse_locs(bp_loc_counts, location_ids)
        
        sub_loc_items = self._conn.query(CorpAsset).filter(CorpAsset.item_id.in_(sub_locations.keys()))
        locations = [{
            **parse_location_item(location_item),
            'blueprint_count': sub_locations[location_item.item_id],
        } for location_item in sub_loc_items]
        
        return locations
    
    def _parse_locs(self, parse_locations, halt_locs):
        locations = self._conn.query(CorpAsset.item_id, CorpAsset.location_id)\
            .filter(CorpAsset.item_id.in_(parse_locations.keys()))\
            .order_by(CorpAsset.location_id.asc())

        sub_locations = {
            location_id: parse_locations[location_id]
            for location_id, parent_id in locations
            if parent_id in halt_locs
        }

        sub_parse_locs = {
            parent_id: sum([parse_locations[item[0]] for item in items])
            for parent_id, items in groupby(locations.all(), lambda x: x[1])
        }

        if sub_parse_locs:
            for key, val in self._parse_locs(sub_parse_locs, halt_locs).items():
                sub_locations[key] = sub_locations.get(key, 0) + val

        return sub_locations
