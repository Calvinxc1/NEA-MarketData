from pandas import DataFrame, Series, concat

from nea_schema.maria.esi.corp import CorpBlueprint
from ....Blueprint.parse_blueprint import parse_blueprint

def build_sankey_blueprints(bp_index, bp_item_ids, conn):
    bp_cols = ['item_id', 'bp_type', 'material_efficiency', 'time_efficiency', 'runs', 'quantity']
    if len(bp_item_ids) == 0:
        blueprints = DataFrame(index=bp_index, columns=bp_cols)
    else:
        blueprints = DataFrame([
            parse_blueprint(bp_item) for bp_item
            in conn.query(CorpBlueprint).filter(CorpBlueprint.item_id.in_(bp_item_ids))
        ]).set_index('type_id')[bp_cols].reindex(bp_index)
        
    blueprints['item_id'].fillna(0, inplace=True)
    blueprints['bp_type'].fillna('dummy', inplace=True)
    blueprints['material_efficiency'].fillna(0, inplace=True)
    blueprints['time_efficiency'].fillna(0, inplace=True)
    blueprints['quantity'].fillna(0, inplace=True)
    blueprints['runs'].fillna(-1, inplace=True)
    return blueprints
