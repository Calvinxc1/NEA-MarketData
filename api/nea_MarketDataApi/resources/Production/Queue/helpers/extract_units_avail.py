from nea_schema.maria.esi.corp import CorpAsset

def extract_units_avail(conn, type_id, station_id):
    asset_items = conn.query(CorpAsset)\
        .filter_by(type_id=type_id, station_id=int(station_id))
    asset_items = [
        asset_item for asset_item in asset_items
        if asset_item.blueprint is None
        or (asset_item.blueprint and asset_item.is_blueprint_copy)
    ]
    units = sum([
        asset_item.quantity * asset_item.blueprint.runs\
            if asset_item.blueprint else asset_item.quantity
        for asset_item in asset_items
    ])
    return units
