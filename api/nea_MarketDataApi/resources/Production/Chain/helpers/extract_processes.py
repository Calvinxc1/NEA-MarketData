from nea_schema.maria.sde.bp import Product
from nea_schema.maria.esi.corp import CorpBlueprint

from .parse_process_item import parse_process_item
from .order_processes import order_processes
from .....tools.extractors import extract_parent_station

def extract_processes(conn, product_items, station_ids=[]):
    blueprint_type_ids = [product_item.blueprint_id for product_item in product_items]
    blueprint_items = conn.query(CorpBlueprint).filter(CorpBlueprint.type_id.in_(blueprint_type_ids))
    processes = order_processes([
        parse_process_item(blueprint_item, product_item, extract_parent_station(conn, blueprint_item.location))
        for product_item in product_items
        for blueprint_item in blueprint_items
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
                    and blueprint_item.quantity == -1
                )
                or product_item.activity.activity_type not in ['copying', 'invention']
            )
    ])
    
    return processes
