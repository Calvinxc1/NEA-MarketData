def make_build_matrix(mats, prods):
    build_matrix = prods.merge(mats, on=['bp_type_id', 'activity'])
    build_matrix['unit_mat_quant'] = build_matrix['mat_quant'] / (build_matrix['prod_quant'] * build_matrix['prod_prob'])
    build_matrix = build_matrix.pivot(index='prod_type_id', columns='mat_type_id', values='unit_mat_quant').fillna(0)
    
    inter_mats = build_matrix.columns[build_matrix.columns.isin(build_matrix.index)]
    while len(inter_mats) > 0:
        inter_matrix = build_matrix.loc[inter_mats].copy()
        inter_matrix = inter_matrix.loc[:,inter_matrix.sum(axis=0) > 0]

        update_matrix = build_matrix.loc[:,inter_matrix.index] @ inter_matrix

        build_matrix.loc[:,inter_mats] = 0
        build_matrix.loc[update_matrix.index, update_matrix.columns] += update_matrix
        build_matrix = build_matrix.loc[:,build_matrix.sum(axis=0) > 0]

        inter_mats = build_matrix.columns[build_matrix.columns.isin(build_matrix.index)]
        
    return build_matrix