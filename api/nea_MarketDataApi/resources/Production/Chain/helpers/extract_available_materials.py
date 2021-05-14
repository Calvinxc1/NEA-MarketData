from nea_schema.maria.esi.corp import CorpAsset
from .....tools.extractors import extract_parent_station

def extract_available_materials(conn, links, station_ids, neg_displace=0.001):
    material_type_ids = [link['type']['id'] for link in links.values()]
    asset_items = conn.query(CorpAsset)\
        .filter(CorpAsset.type_id.in_(material_type_ids), CorpAsset.station_id.in_(station_ids))
    
    material_counts = {}
    for asset_item in asset_items:
        quant = asset_item.quantity
        if asset_item.blueprint:
            if asset_item.blueprint.quantity == -1:
                quant = None
            elif asset_item.blueprint.quantity == -2:
                quant *= asset_item.blueprint.runs
            
        if quant is None and material_counts.get(asset_item.type_id, 0) >= 0:
            material_counts[asset_item.type_id] = -material_counts.get(asset_item.type_id, 0) - neg_displace
        elif material_counts.get(asset_item.type_id, 0) < 0:
            material_counts[asset_item.type_id] = material_counts.get(asset_item.type_id, 0) - quant
        elif quant:
            material_counts[asset_item.type_id] = material_counts.get(asset_item.type_id, 0) + quant
            
    material_counts = {key:round(val) for key, val in material_counts.items()}
        
    return material_counts
