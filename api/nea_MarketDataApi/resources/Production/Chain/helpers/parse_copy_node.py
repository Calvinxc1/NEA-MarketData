from .....tools.parsers import parse_type
from .select_blueprint import select_blueprint
from ...helpers import calc_prod_time

def parse_copy_node(activity_item, output_units, blueprints, station_ids):
    node = {
        'node_id': activity_item.blueprint_id,
        'type': parse_type(activity_item.blueprint.type),
        'product': {
            'type':parse_type(activity_item.blueprint.type),
            'quantity': 1,
            'probability': 1,
        },
        'activity': {
            'type': activity_item.activity_type,
            'time': activity_item.time,
        },
        'output_units': output_units,
        'output_runs': output_units,
    }
    
    if len(station_ids) > 0:
        blueprints = [
            blueprint for blueprint in blueprints
            if blueprint['parent_station'] in station_ids
        ]
        
    node['items'] = {
        'options': {blueprint['item_id']:blueprint for blueprint in blueprints},
        'selected': select_blueprint(blueprints),
    }
    
    node['prod_time'] = calc_prod_time(activity_item.time, 0, output_units)
    
    return node