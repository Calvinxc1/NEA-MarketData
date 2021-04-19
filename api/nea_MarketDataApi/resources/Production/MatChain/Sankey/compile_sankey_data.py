from ..calc_mat_needs import calc_mat_needs

def compile_sankey_data(active_prods, materials, products, blueprints):
    nodes = {}
    edges = []
    
    for i, product in active_prods.iterrows():
        node = {
            'id': i,
            **product,
            'name': product['bp_type_name'],
            'runs': product['output_target'] / (product['quantity'] * product['probability']),
            'fixedValue': 1,
        }
        
        if product['activity_type'] != 'purchasing':
            node['blueprint'] = blueprints.loc[product['bp_type_id']].to_dict()

        active_mats_mask = (materials['bp_type_id'] == product['bp_type_id'])\
            & (materials['activity_type'] == product['activity_type'])
        active_mats = materials.loc[active_mats_mask].copy()
        active_mats['source'] = active_mats['mat_type_id']\
            .map(products.reset_index().set_index('prod_type_id')['index'])

        active_mats['target'] = i
        if product['activity_type'] == 'manufacturing':
            active_mats['mat_needs'] = calc_mat_needs(
                active_mats['quantity'],
                node['runs'],
                node.get('blueprint', {}).get('material_efficiency', 0)
            )
        else:
            active_mats['mat_needs'] = calc_mat_needs(active_mats['quantity'], node['runs'], 0)

        next_prod_targets = active_mats.set_index('mat_type_id')['mat_needs']
        next_prods = products.reset_index().set_index('prod_type_id').loc[next_prod_targets.index]\
            .reset_index().rename(columns={'mat_type_id':'prod_type_id'}).set_index('index')
        next_prods['output_target'] = next_prod_targets.values
        
        sub_nodes, sub_edges = compile_sankey_data(next_prods, materials, products, blueprints)

        for key, val in sub_nodes.items():
            if key in nodes.keys():
                nodes[key]['output_target'] += val['output_target']
                nodes[key]['runs'] += val['runs']
            else:
                nodes[key] = val
                
        if i in nodes.keys():
            nodes[i]['output_target'] += node['output_target']
            nodes[i]['runs'] += node['runs']
        else:
            nodes[i] = node
            
        node = nodes[i]
        
        for _, row in active_mats.reset_index().astype(object).iterrows():
            new_edge = {**row.to_dict(), 'value': row['mat_needs'] / (node['incoming_mats'] * node['runs'])}
            
            matched = False
            for edge in edges:
                same_check = edge['source'] == new_edge['source']\
                    and edge['target'] == new_edge['target']\
                    and edge['mat_type_id'] == new_edge['mat_type_id']
                if same_check:
                    edge['mat_needs'] += new_edge['mat_needs']
                    edge['value'] = edge['mat_needs'] / (node['incoming_mats'] * node['runs'])
                    matched = True
                    break
                    
            if matched: break
            else: edges.append(new_edge)
                
        for new_edge in sub_edges:
            matched = False
            for edge in edges:
                same_check = edge['source'] == new_edge['source']\
                    and edge['target'] == new_edge['target']\
                    and edge['mat_type_id'] == new_edge['mat_type_id']
                if same_check:
                    edge['mat_needs'] += new_edge['mat_needs']
                    edge['value'] = edge['mat_needs'] / (node['incoming_mats'] * node['runs'])
                    matched = True
                    break
                    
            if matched: break
            else: edges.append(new_edge)
        
    return nodes, edges
