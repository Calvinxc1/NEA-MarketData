from pandas import DataFrame
import numpy as np

from nea_schema.maria.esi.corp import CorpBlueprint

columns = [
    'item_id', 'type_id', 'type_name', 'category_id',
    'material_efficiency', 'time_efficiency', 'quantity', 'runs',
    'location_id', 'location_flag'
]

def collect_blueprints(conn):
    query = conn.query(CorpBlueprint)
    blueprints = DataFrame([{
        'item_id': row.item_id,
        'type_id': row.type_id,
        'type_name': row.type.type_name,
        'category_id': row.type.group.category_id,
        'location_id': row.location_id,
        'location_flag': row.location_flag,
        'material_efficiency': row.material_efficiency,
        'time_efficiency': row.time_efficiency,
        'quantity': row.quantity,
        'runs': row.runs,
    } for row in query], columns=columns)
    
    blueprints['bp_type'] = 'original'
    blueprints.loc[blueprints['quantity'] == -2, 'bp_type'] = 'copy'
    blueprints.loc[blueprints['category_id'] == 34, 'bp_type'] = 'relic'
    blueprints.drop(columns='category_id', inplace=True)
    
    blueprints['quantity'].clip(lower=0, inplace=True)
    
    return blueprints
