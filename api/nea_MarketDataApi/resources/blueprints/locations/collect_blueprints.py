from pandas import DataFrame

from nea_schema.maria.esi.corp import CorpBlueprint

columns = ['item_id', 'type_id', 'type_name', 'material_efficiency', 'time_efficiency', 'quantity', 'runs', 'location_id', 'location_flag']

def collect_blueprints(conn):
    query = conn.query(CorpBlueprint)
    blueprints = DataFrame([{
        'item_id': row.item_id,
        'type_id': row.type_id,
        'type_name': row.type.type_name,
        'material_efficiency': row.material_efficiency,
        'time_efficiency': row.time_efficiency,
        'quantity': row.quantity,
        'runs': row.runs,
        'location_id': row.location_id,
        'location_flag': row.location_flag,
    } for row in query]).set_index('item_id')
    return blueprints
