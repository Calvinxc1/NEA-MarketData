def extract_asset_location(asset, location_limits=[]):
    if asset.location_id in location_limits: return asset
    elif not asset.parent: return asset
    else: return extract_asset_location(asset.parent, location_limits)
