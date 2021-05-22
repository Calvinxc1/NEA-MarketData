from sqlalchemy import and_, or_, func

from nea_schema.maria.esi.corp import CorpAsset, CorpIndustry

def extract_units_avail(conn, type_id, station_id, units_used={}):
    asset_items = [
        asset_item for asset_item
        in conn.query(CorpAsset).filter_by(type_id=type_id, station_id=int(station_id))
        if asset_item.blueprint is None
        or (asset_item.blueprint and asset_item.is_blueprint_copy)
    ]
    asset_units = sum([
        asset_item.quantity * asset_item.blueprint.runs\
            if asset_item.blueprint else asset_item.quantity
        for asset_item in asset_items
    ])
    
    asset_date = conn.query(func.max(CorpAsset.record_time)).one()[0]
    industry_items_complete = conn.query(CorpIndustry).filter(
        CorpIndustry.product_type_id == type_id,
        CorpIndustry.status == 'delivered',
        CorpIndustry.end_date > asset_date,
    )
    industry_units_complete = sum([
        industry_item.runs * industry_item.licensed_runs * industry_item.probability\
            if industry_item.activity_type == 'copying'\
            else industry_item.runs * industry_item.product.quantity * industry_item.probability
        for industry_item in industry_items_complete
    ])
    
    industry_items_active = conn.query(CorpIndustry).filter(
        CorpIndustry.product_type_id == type_id,
        CorpIndustry.status.in_(['active', 'paused']),
    )
    industry_units_active = sum([
        industry_item.runs * industry_item.licensed_runs * industry_item.probability\
            if industry_item.activity_type == 'copying'\
            else industry_item.runs * industry_item.product.quantity * industry_item.probability
        for industry_item in industry_items_active
    ])
    
    units = {
        'asset': (asset_units + industry_units_complete) - units_used.get('asset', 0),
        'industry': industry_units_active - units_used.get('industry', 0),
        'total': (asset_units + industry_units_complete + industry_units_active)\
            - (units_used.get('asset', 0) + units_used.get('industry', 0)),
    }
    
    return units
