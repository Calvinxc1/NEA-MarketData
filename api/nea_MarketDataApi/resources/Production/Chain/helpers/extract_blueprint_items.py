from nea_schema.maria.sde.bp import Product
from nea_schema.maria.esi.corp import CorpBlueprint

from .calc_efficiency_ratio import calc_efficiency_ratio
from .parse_blueprint_placeholder import parse_blueprint_placeholder
from .....tools.extractors import extract_parent_station
from .....tools.parsers import parse_blueprint_item

def extract_blueprint_items(conn, product_items, station_ids=[]):
    blueprint_placeholders = [{
        **parse_blueprint_placeholder(
            product_item,
            invention=conn.query(Product).filter_by(type_id=product_item.blueprint_id).count(),
        ),
        'efficency_ratio': calc_efficiency_ratio(0, product_item.quantity, product_item.probability),
    } for product_item in product_items]
    
    blueprint_type_ids = [placeholder['type']['id'] for placeholder in blueprint_placeholders]
    blueprint_item_query = conn.query(CorpBlueprint).filter(CorpBlueprint.type_id.in_(blueprint_type_ids))
    blueprint_items = [
        {
            **parse_blueprint_item(blueprint_item, include_activities=False),
            'parent_station': extract_parent_station(conn, blueprint_item.location),
            'efficency_ratio': calc_efficiency_ratio(
                blueprint_item.material_efficiency, product_item.quantity, product_item.probability
            ),
            'activity_type': product_item.activity.activity_type,
        } for product_item in product_items
        for blueprint_item in blueprint_item_query
        if product_item.blueprint_id == blueprint_item.type_id
    ]
    
    blueprint_items = [
        blueprint_item for blueprint_item in blueprint_items
        if blueprint_item['parent_station']['station_id'] in station_ids
    ]
    
    blueprints = [*blueprint_items, *blueprint_placeholders]
    return blueprints
