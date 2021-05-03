from nea_schema.maria.sde.bp import Product
from nea_schema.maria.esi.corp import CorpBlueprint

from .calc_efficiency_ratio import calc_efficiency_ratio
from .....tools.extractors import extract_parent_station
from .....tools.parsers import parse_blueprint_item, parse_blueprint_product

def extract_process_items(conn, product_items, station_ids=[]):
    blueprint_type_ids = [product_item.blueprint_id for product_item in product_items]
    blueprint_item_query = conn.query(CorpBlueprint).filter(CorpBlueprint.type_id.in_(blueprint_type_ids))
    process_items = sorted([{
        'blueprint': parse_blueprint_item(blueprint_item, include_activities=False),
        'product': parse_blueprint_product(product_item),
        'efficiency_ratio': calc_efficiency_ratio(
            blueprint_item.material_efficiency, product_item.quantity, product_item.probability
        ),
        'activity': {
            'type': product_item.activity.activity_type,
            'time': product_item.activity.time,
        },
        'material_items': product_item.activity.material,
        'station_industry': extract_parent_station(conn, blueprint_item.location)['industry'],
    } for product_item in product_items
        for blueprint_item in blueprint_item_query
        if product_item.blueprint_id == blueprint_item.type_id
        and extract_parent_station(conn, blueprint_item.location)['station_id'] in station_ids
        and (
                (
                    product_item.activity.activity_type == 'invention'
                    and (
                        blueprint_item.quantity == -2
                        or blueprint_item.type.group.category.category_id == 34
                    )
                ) or (
                    product_item.activity.activity_type == 'copying'
                    and blueprint_item.quantity != -2
                    and blueprint_item.type.group.category.category_id != 34
                )
                or product_item.activity.activity_type not in ['copying', 'invention']
            )
    ], key=lambda x: x['efficiency_ratio'], reverse=True)
    
    return process_items
