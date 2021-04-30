from nea_schema.maria.sde.bp import Product
from nea_schema.maria.sde.inv import Type
from nea_schema.maria.esi.corp import CorpBlueprint

from .build_market_node import build_market_node
from .extract_asset_count import extract_asset_count
from .merge_link import merge_link
from .merge_node import merge_node
from .parse_copy_node import parse_copy_node
from .parse_invent_link import parse_invent_link
from .parse_invent_bp_link import parse_invent_bp_link
from .parse_link import parse_link
from .parse_node import parse_node
from .....tools.extractors import extract_blueprints_info

def extract_sankey_elements(conn, product_item, output_units, station_ids=[], ignore_activity=['reaction']):
    nodes = {}
    links = {}
    
    if product_item.activity.activity_type in ignore_activity:
        type_item = conn.query(Type).filter_by(type_id=product_item.type_id).one()
        market_node = build_market_node(type_item, output_units)
        return {market_node['node_id']:market_node}, {}
    
    blueprint_items = conn.query(CorpBlueprint.item_id).filter_by(type_id=product_item.blueprint_id)
    if product_item.activity.activity_type == 'invention': blueprint_items = blueprint_items.filter_by(quantity=-2)
    blueprint_item_ids = [row[0] for row in blueprint_items]
    blueprints = extract_blueprints_info(conn, blueprint_item_ids, include_activities=False)
    
    node = parse_node(product_item, output_units, blueprints, station_ids)
    nodes = merge_node(nodes, node)
    
    invent_product_item = conn.query(Product).filter_by(type_id=node['type']['id']).one_or_none()
    if invent_product_item:
        invent_bp_link = parse_invent_bp_link(invent_product_item, node)
        invent_bp_link['available_units'] = extract_asset_count(conn, invent_bp_link['source'], station_ids)
        links = merge_link(links, invent_bp_link)
        
        invent_nodes, invent_links = extract_sankey_elements(conn, invent_product_item, node['output_runs'], station_ids, ignore_activity)
        for invent_node in invent_nodes.values(): nodes = merge_node(nodes, invent_node)
        for invent_link in invent_links.values(): links = merge_link(links, invent_link)
    
    for material_item in product_item.activity.material:
        sub_nodes, sub_links = extract_link(conn, material_item, node, station_ids, ignore_activity)
        for sub_node in sub_nodes.values(): nodes = merge_node(nodes, sub_node)
        for sub_link in sub_links.values(): links = merge_link(links, sub_link)
            
    if product_item.activity.activity_type == 'invention':
        invent_link = parse_invent_link(product_item, node['output_runs'])
        invent_link['available_units'] = extract_asset_count(conn, invent_link['source'], station_ids)
        links = merge_link(links, invent_link)
        
        copy_activity_item = [
            activity for activity in product_item.activity.blueprint.activity
            if activity.activity_type == 'copying'
        ][0]
        copy_blueprint_items = conn.query(CorpBlueprint.item_id).filter_by(type_id=product_item.blueprint_id, quantity=-1)
        copy_blueprint_item_ids = [row[0] for row in copy_blueprint_items]
        copy_blueprints = extract_blueprints_info(conn, blueprint_item_ids, include_activities=False)
        copy_node = parse_copy_node(copy_activity_item, node['output_runs'], copy_blueprints, station_ids)
        nodes = merge_node(nodes, copy_node)
        
        for material_item in copy_activity_item.material:
            sub_nodes, sub_links = extract_link(conn, material_item, copy_node, station_ids, ignore_activity)
            for sub_node in sub_nodes.values(): nodes = merge_node(nodes, sub_node)
            for sub_link in sub_links.values(): links = merge_link(links, sub_link)
            
    return nodes, links

def extract_link(conn, material_item, node, station_ids, ignore_activity):
    link = parse_link(material_item, node)
    link['available_units'] = extract_asset_count(conn, material_item.type_id, station_ids)
    
    try:
        material_product_item = conn.query(Product).filter_by(type_id=link['source']).one_or_none()
    except Exception as e:
        print(link)
        raise Exception(e)
    
    if material_product_item:
        nodes, sub_links = extract_sankey_elements(conn, material_product_item, link['units'], station_ids, ignore_activity)
        links = merge_link(sub_links, link)
    else:
        type_item = conn.query(Type).filter_by(type_id=link['source']).one()
        market_node = build_market_node(type_item, link['units'])
        nodes = {market_node['node_id']: market_node}
        links = {link['link_id']: link}
        
    return nodes, links
