from ..calc_mat_needs import calc_mat_needs

def compile_sankey_data(active_prods, materials, products, blueprints, _logger=None):
    nodes = {}
    edges = []
    
    for i, product in active_prods.iterrows():
        nodes[i] = {
            'id': i,
            **product,
            'name': product['bp_type_name'],
            'runs': product['output_target'] / (product['quantity'] * product['probability']),
            'fixedValue': 1,
        }
        
        if product['activity_type'] != 'purchasing':
            nodes[i]['blueprint'] = blueprints.loc[product['bp_type_id']].to_dict()

        active_mats = materials.loc[materials['bp_type_id'] == product['bp_type_id']].copy()
        active_mats['source'] = active_mats['mat_type_id']\
                .map(products.reset_index().set_index('prod_type_id')['index'])

        active_mats['target'] = i
        active_mats['mat_needs'] = calc_mat_needs(
            active_mats['quantity'],
            nodes[i]['runs'],
            nodes[i].get('blueprint', {}).get('material_efficiency', 0)
        )
        edges.extend([
            {**row.to_dict(), 'value': row['mat_needs'] / (nodes[i]['incoming_mats'] * nodes[i]['runs'])} for _, row
            in active_mats.reset_index().astype(object).iterrows()
        ])

        next_prod_mask = active_mats['bp_type_id'] != active_mats['mat_type_id']
        next_prod_targets = active_mats.loc[next_prod_mask].set_index('source')['mat_needs'].rename('output_target')
        next_prods = products.loc[next_prod_targets.index].join(next_prod_targets)
        
        sub_nodes, sub_edges = compile_sankey_data(next_prods, materials, products, blueprints, _logger=_logger)
        
        for key, val in sub_nodes.items():
            if key in nodes.keys():
                nodes[key]['output_target'] += val['output_target']
                nodes[key]['runs'] += val['runs']
            else:
                nodes[key] = val        
        
        edges.extend(sub_edges)
        
    return nodes, edges
