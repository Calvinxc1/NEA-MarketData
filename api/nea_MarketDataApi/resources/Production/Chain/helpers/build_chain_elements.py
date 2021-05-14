from nea_schema.maria.sde.bp import Product
from nea_schema.maria.sde.inv import Type

from .extract_node import extract_node
from .extract_link import extract_link
from .extract_copy_node import extract_copy_node
from .....tools.parsers import parse_type

def build_chain_elements(conn, type_id, output_units, station_ids, ignore_activity):
    node = extract_node(conn, type_id, output_units, station_ids, ignore_activity)
    nodes = {node['node_id']:node}
    links = {}
    for material in node['materials']:
        link = extract_link(conn, material, node)
        links[link['link_id']] = link
        sub_nodes, sub_links = build_chain_elements(
            conn,
            material['type_id'],
            material['quantity'],
            station_ids,
            ignore_activity,
        )
        nodes, links = combine_elements(conn, nodes, links, sub_nodes, sub_links, station_ids, ignore_activity)
        
    return nodes, links

def combine_elements(conn, current_nodes, current_links, new_nodes, new_links, station_ids, ignore_activity):
    for node_id, node in new_nodes.items():
        if node_id in current_nodes:
            new_output_units = current_nodes[node_id]['output_units'] + node['output_units']
            recalc_nodes, recalc_links = build_chain_elements(
                conn, node_id, new_output_units,
                station_ids, ignore_activity,
            )
            new_nodes = {**new_nodes, **recalc_nodes}
            new_links = {**new_links, **recalc_links}
            
    nodes = {**current_nodes, **new_nodes}
    links = {**current_links, **new_links}
    
    return nodes, links
