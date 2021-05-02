from nea_schema.maria.sde.bp import Product
from nea_schema.maria.sde.inv import Type
from nea_schema.maria.esi.corp import CorpBlueprint

from .build_market_node import build_market_node
from .extract_asset_count import extract_asset_count
from .extract_blueprint_items import extract_blueprint_items
from .merge_link import merge_link
from .merge_node import merge_node
from .parse_copy_node import parse_copy_node
from .parse_invent_link import parse_invent_link
from .parse_invent_bp_link import parse_invent_bp_link
from .parse_link import parse_link
from .parse_node import parse_node
from .select_blueprint import select_blueprint
from .....tools.extractors import extract_blueprints_info

def extract_sankey_elements(conn, product_items, output_units, station_ids=[], bp_items={}, ignore_activity=['reaction']):
    nodes = {}
    links = {}
    
    active_product_items = product_items.filter(Product.activity_type.notin_(ignore_activity))
    blueprints = extract_blueprint_items(conn, active_product_items, station_ids)
    active_blueprints = [
        blueprint for blueprint in blueprints
        if (blueprint.get('activity_type') == 'invention' and blueprint['bp_type'] in ['copy', 'placeholder'])
        or blueprint.get('activity_type') != 'invention'
    ]
    selection = select_blueprint(active_blueprints, bp_items.get(product_items.first().type_id))
    blueprint_items = {'options': active_blueprints, 'selected': selection}

    if selection is None:
        type_item = conn.query(Type).filter_by(type_id=product_items.first().type_id).one()
        market_node = build_market_node(type_item, output_units)
        market_node['available_units'] = extract_asset_count(conn, market_node['node_id'], station_ids)
        return {market_node['node_id']:market_node}, {}

    product_item = product_items.filter_by(blueprint_id=selection['type']['id']).one()
    
    node = parse_node(product_item, output_units, blueprint_items)
    node['available_units'] = extract_asset_count(conn, node['node_id'], station_ids)
    nodes = merge_node(nodes, node)
    
    invent_product_items = conn.query(Product).filter_by(type_id=node['type']['id'])
    if invent_product_items.count() > 0:
        invent_bp_link = parse_invent_bp_link(invent_product_items.first(), node)
        invent_bp_link['available_units'] = extract_asset_count(conn, invent_bp_link['source'], station_ids)
        links = merge_link(links, invent_bp_link)
        
        invent_nodes, invent_links = extract_sankey_elements(conn, invent_product_items, node['output_runs'], station_ids, bp_items, ignore_activity)
        for invent_node in invent_nodes.values(): nodes = merge_node(nodes, invent_node)
        for invent_link in invent_links.values(): links = merge_link(links, invent_link)
    
    for material_item in product_item.activity.material:
        sub_nodes, sub_links = extract_link(conn, material_item, node, station_ids, bp_items, ignore_activity)
        for sub_node in sub_nodes.values(): nodes = merge_node(nodes, sub_node)
        for sub_link in sub_links.values(): links = merge_link(links, sub_link)
            
    if product_item.activity.activity_type == 'invention':
        invent_link = parse_invent_link(product_item, node['output_runs'])
        invent_link['available_units'] = extract_asset_count(conn, invent_link['source'], station_ids)
        links = merge_link(links, invent_link)
        
        copy_activity_items = [
            activity for activity in product_item.activity.blueprint.activity
            if activity.activity_type == 'copying'
        ]
        
        if len(copy_activity_items) == 1:
            copy_activity_item = copy_activity_items[0]
            copy_blueprints = [blueprint for blueprint in blueprints if blueprint['bp_type'] in ['original', 'placeholder']]
            copy_selection = select_blueprint(copy_blueprints, bp_items.get(copy_activity_item.blueprint_id))
            copy_blueprint_items = {'options': copy_blueprints, 'selected': copy_selection}
            copy_node = parse_copy_node(copy_activity_item, node['output_runs'], copy_blueprint_items)
            copy_node['available_units'] = extract_asset_count(conn, copy_node['node_id'], station_ids)
            nodes = merge_node(nodes, copy_node)

            for material_item in copy_activity_item.material:
                sub_nodes, sub_links = extract_link(conn, material_item, copy_node, station_ids, bp_items, ignore_activity)
                for sub_node in sub_nodes.values(): nodes = merge_node(nodes, sub_node)
                for sub_link in sub_links.values(): links = merge_link(links, sub_link)
        else:
            type_item = conn.query(Type).filter_by(type_id=product_item.blueprint_id).one()
            market_node = build_market_node(type_item, node['output_runs'])
            market_node['available_units'] = extract_asset_count(conn, market_node['node_id'], station_ids)
            nodes = merge_node(nodes, market_node)
            
    return nodes, links

def extract_link(conn, material_item, node, station_ids, bp_items, ignore_activity):
    link = parse_link(material_item, node)
    link['available_units'] = extract_asset_count(conn, material_item.type_id, station_ids)
    material_product_items = conn.query(Product).filter_by(type_id=link['source'])
    
    if material_product_items.count() > 0:
        nodes, sub_links = extract_sankey_elements(conn, material_product_items, link['units'], station_ids, bp_items, ignore_activity)
        links = merge_link(sub_links, link)
    else:
        type_item = conn.query(Type).filter_by(type_id=link['source']).one()
        market_node = build_market_node(type_item, link['units'])
        market_node['available_units'] = extract_asset_count(conn, market_node['node_id'], station_ids)
        nodes = {market_node['node_id']: market_node}
        links = {link['link_id']: link}
        
    return nodes, links
