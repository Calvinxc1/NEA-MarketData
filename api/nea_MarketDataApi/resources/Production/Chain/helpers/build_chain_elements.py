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
            
    blueprint_runs = {}
    for process in node['process']:
        if 'blueprint' not in process: continue
        bp_type_id = process['blueprint']['type']['id']
        blueprint_runs[bp_type_id] = blueprint_runs.get(bp_type_id, 0) + process['batch']['runs']
        
    for bp_type_id, runs in blueprint_runs.items():
        invent_nodes, invent_links = build_invent_elements(conn, type_id, bp_type_id, runs, station_ids, ignore_activity)
        nodes, links = combine_elements(conn, nodes, links, invent_nodes, invent_links, station_ids, ignore_activity)
        
    return nodes, links

def build_invent_elements(conn, type_id, bp_type_id, runs, station_ids, ignore_activity):
    invent_nodes = {}
    invent_links = {}

    sub_nodes, sub_links = build_chain_elements(conn, bp_type_id, runs, station_ids, ignore_activity)
    if sub_links:
        manufacture_link = {
            'link_id': '{}-{}'.format(bp_type_id, type_id),
            'source': bp_type_id,
            'target': type_id,
            'type': parse_type(conn.query(Type).filter_by(type_id=bp_type_id).one()),
            'quantity': runs,
        }
        manufacture_link['volume'] = manufacture_link['quantity'] * manufacture_link['type']['volume']
        invent_links[manufacture_link['link_id']] = manufacture_link
        
        bpc_materials = {}
        for process in sub_nodes[bp_type_id]['process']:
            bpc_materials[process['blueprint']['type']['id']] = bpc_materials.get(process['blueprint']['type']['id'], 0)\
                + process['batch']['runs']

        sub_nodes[bp_type_id]['materials'].extend([
            {'type_id': copy_type_id, 'quantity': quantity}
            for copy_type_id, quantity in bpc_materials.items()
        ])

        invent_nodes, invent_links = combine_elements(
            conn, invent_nodes, invent_links, sub_nodes, sub_links, station_ids, ignore_activity
        )

        for copy_type_id, quantity in bpc_materials.items():
            copy_nodes, copy_links = build_copy_elements(
                conn, bp_type_id, copy_type_id, quantity, station_ids, ignore_activity
            )
            invent_nodes, invent_links = combine_elements(
                conn, invent_nodes, invent_links, copy_nodes, copy_links, station_ids, ignore_activity
            )
    return invent_nodes, invent_links

def build_copy_elements(conn, bp_type_id, copy_type_id, quantity, station_ids, ignore_activity):
    invent_link = {
        'link_id': '{}-{}'.format(copy_type_id, bp_type_id),
        'source': copy_type_id,
        'target': bp_type_id,
        'type': parse_type(conn.query(Type).filter_by(type_id=copy_type_id).one()),
        'quantity': quantity,
    }
    invent_link['volume'] = invent_link['quantity'] * invent_link['type']['volume']
    copy_links = {invent_link['link_id']:invent_link} 

    copy_node = extract_copy_node(conn, copy_type_id, quantity, station_ids)
    copy_nodes = {copy_node['node_id']:copy_node}

    for material in copy_node['materials']:
        copy_link = extract_link(conn, material, copy_node)
        copy_links[copy_link['link_id']] = copy_link
        sub_nodes, sub_links = build_chain_elements(
            conn,
            material['type_id'],
            material['quantity'],
            station_ids,
            ignore_activity,
        )
        copy_nodes, copy_links = combine_elements(
            conn, copy_nodes, copy_links, sub_nodes, sub_links, station_ids, ignore_activity
        )
    return copy_nodes, copy_links

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
