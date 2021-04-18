from pandas import DataFrame

def build_missing_products(products, materials):
    missing_mats = materials.loc[
        ~materials['mat_type_id'].isin(products['prod_type_id']),
        ['mat_type_id', 'mat_type_name']
    ].drop_duplicates()

    missing_products = DataFrame([{
        'bp_type_id': -1,
        'bp_type_name': 'Market',
        'activity_type': 'purchasing',
        'prod_type_id': row['mat_type_id'],
        'prod_type_name': row['mat_type_name'],
        'quantity': 1,
        'probability': 1.0,
    } for _, row in missing_mats.iterrows()])
    
    return missing_products
