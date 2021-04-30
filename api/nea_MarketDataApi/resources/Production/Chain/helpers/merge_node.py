from ...helpers import calc_prod_time

def merge_node(nodes, node):
    if node['node_id'] in nodes.keys():
        node = {**node}
        node['output_units'] += nodes[node['node_id']]['output_units']
        node['output_runs'] = node['output_units'] / (node['product']['quantity'] * node['product']['probability'])
        node['prod_time'] = calc_prod_time(
            node['activity']['time'],
            node['items']['options'].get(node['items']['selected'], {}).get('time_efficiency', 0),
            node['output_runs'],
        )
    
    nodes = {**nodes, node['node_id']: node}
    
    return nodes
