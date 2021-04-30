from .....tools.parsers import parse_blueprint_product, parse_type
from .select_blueprint import select_blueprint
from ...helpers import calc_prod_time

def parse_node(product_item, output_units=1, blueprints=[], station_ids=[]):
    node = {
        'node_id': product_item.type_id,
        'type': parse_type(product_item.activity.blueprint.type),
        'product': parse_blueprint_product(product_item),
        'activity': {
            'type': product_item.activity.activity_type,
            'time': product_item.activity.time,
        },
        'output_units': output_units,
        'output_runs': output_units / (product_item.quantity * product_item.probability),
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
    
    node['prod_time'] = calc_prod_time(
        product_item.activity.time,
        node['items']['options'].get(node['items']['selected'], {}).get('time_efficiency', 0),
        node['output_runs'],
    )
    
    return node
