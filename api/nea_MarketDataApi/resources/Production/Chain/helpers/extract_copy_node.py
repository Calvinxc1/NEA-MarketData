from nea_schema.maria.sde.inv import Type
from nea_schema.maria.sde.bp import Activity
from nea_schema.maria.esi.corp import CorpBlueprint

from .parse_copy_placeholder import parse_copy_placeholder
from ...helpers import calc_prod_time
from .....tools.extractors import extract_parent_station
from .....tools.parsers import parse_blueprint_item, parse_type

def extract_copy_node(conn, type_id, output_units, station_ids):
    node = {
        'node_id': type_id,
        'output_units': output_units,
        'type': parse_type(conn.query(Type).filter_by(type_id=type_id).one()),
        'process': [],
        'process_options': [],
        'materials': {},
    }
    
    activity_item = conn.query(Activity).filter_by(activity_type='copying', blueprint_id=type_id).one()
    blueprint_items = conn.query(CorpBlueprint).filter_by(type_id=type_id, quantity=-1)
    process_items = [
        {
            'blueprint': parse_blueprint_item(blueprint_item, include_activities=False),
            'product': {
                'type': parse_type(blueprint_item.type),
                'quantity': 1,
                'probability': 1.0,
            },
            'efficiency_ratio': 1,
            'activity': {
                'type': activity_item.activity_type,
                'time': activity_item.time,
            },
            'material_items': activity_item.material,
            'station_industry': extract_parent_station(conn, blueprint_item.location),
        } for blueprint_item in blueprint_items
        if extract_parent_station(conn, blueprint_item.location)['station_id'] in station_ids
    ]
    process_items = [*process_items, parse_copy_placeholder(activity_item)]
    
    process = process_items[0]
    node['process'].append({
        **process,
        'batch': {
            'runs': output_units,
            'chance': 1,
            'units': output_units,
            'seconds': calc_prod_time(
                process['activity']['time'],
                process['blueprint']['time_efficiency'],
                process['station_industry'].get('strEngTimeBonus', 1),
                output_units,
            ),
        },
    })
    
    material_items = node['process'][-1].pop('material_items')
    for material_item in material_items:
        run_mat_usage = material_item.quantity * output_units
        node['materials'][material_item.type_id] = node['materials'].get(material_item.type_id, 0) + run_mat_usage
    
    node['process_options'] = process_items
    [process_item.pop('material_items') for process_item in node['process_options']]
    
    node['materials'] = [
        {'type_id': key, 'quantity': val}
        for key, val in node['materials'].items()
    ]
    
    return node
