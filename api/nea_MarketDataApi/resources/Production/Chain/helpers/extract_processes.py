from nea_schema.maria.sde.bp import Product
from nea_schema.maria.esi.corp import CorpBlueprint

from .parse_process_item import parse_process_item
from .order_processes import order_processes
from .extract_placeholder import extract_placeholder
from .....tools.extractors import extract_parent_station

def extract_processes(conn, product_items, station_ids=[]):
    processes = []
    for product_item in product_items:
        blueprint_items = conn.query(CorpBlueprint).filter_by(type_id=product_item.blueprint_id)
        for blueprint_item in blueprint_items:
            parent_station = extract_parent_station(conn, blueprint_item.location)
            
            if parent_station['station_id'] not in station_ids:
                continue
            if product_item.activity.activity_type == 'copying'\
                and blueprint_item.quantity != -1:
                continue
            if product_item.activity.activity_type == 'invention'\
                and (blueprint_item.quantity != -2 and blueprint_item.type.group.category.category_id != 34):
                continue
            
            invented = conn.query(Product).filter_by(type_id=blueprint_item.type_id).count() > 0
            process = parse_process_item(blueprint_item, product_item, parent_station, invented)
            processes.append(process)
            
    processes = order_processes(processes)
    processes = [*processes, extract_placeholder(conn, product_items)]
    
    return processes
