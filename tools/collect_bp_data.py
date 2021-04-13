import pandas as pd
import numpy as np

from nea_schema.maria.sde.bp import Blueprint

def collect_bp_data(bp_data, conn, bp_types=None):
    bp_types = [int(val) for val in bp_data['bp_type_id']] if bp_types is None else bp_types
    query = conn.query(Blueprint).filter(Blueprint.type_id.in_(bp_types))
    
    mats = []
    prods = []
    invent_bp_types = []
    for blueprint in query:
        corp_bp = bp_data.loc[bp_data['bp_type_id'] == blueprint.type_id]
        if len(corp_bp) == 0:
            mat_eff = 2
        else:
            mat_eff = corp_bp['material_efficiency'].max()
        
        for activity in blueprint.activity:
            if activity.activity_type in ['manufacturing', 'invention']:
                for material in activity.material:
                    mats.append({
                        'bp_type_id': blueprint.type_id,
                        'activity': activity.activity_type,
                        'mat_eff': mat_eff,
                        'mat_type_id': material.type_id,
                        'mat_type_name': material.type.type_name,
                        'mat_quant': material.quantity,
                        'adj_mat_quant': max(1, np.ceil(round(material.quantity * (1 - (mat_eff/100)),2)))
                    })
                for product in activity.product:
                    prods.append({
                        'bp_type_id': blueprint.type_id,
                        'activity': activity.activity_type,
                        'prod_type_id': product.type_id,
                        'prod_type_name': product.type.type_name,
                        'prod_quant': product.quantity,
                        'prod_prob': product.probability,
                    })
                    if activity.activity_type == 'invention':
                        invent_bp_types.append(product.type_id)
                        mats.append({
                            'bp_type_id': product.type_id,
                            'activity': 'manufacturing',
                            'mat_eff': 0,
                            'mat_type_id': product.type_id,
                            'mat_type_name': product.type.type_name,
                            'mat_quant': 1,
                            'adj_mat_quant': 1,
                        })
                
    if len(invent_bp_types) > 0:
        invent_mats, invent_prods = collect_bp_data(bp_data, conn, invent_bp_types)
        mats.extend(invent_mats)
        prods.extend(invent_prods)
    
    return mats, prods