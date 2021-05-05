from numpy import inf

from nea_schema.maria.sde.bp import Product
from nea_schema.maria.sde.inv import Type

from .extract_market_process import extract_market_process
from .extract_process_items import extract_process_items
from .parse_placeholder import parse_placeholder
from ...helpers import calc_invent_chance, calc_mat_needs, calc_prod_time
from .....tools.parsers import parse_type

def extract_node(conn, type_id, output_units, station_ids, ignore_activity):
    node = {
        'node_id': type_id,
        'output_units': output_units,
        'type': parse_type(conn.query(Type).filter_by(type_id=type_id).one()),
        'process': [],
        'process_options': [],
        'materials': {},
    }
    
    product_items = conn.query(Product).filter(Product.type_id == type_id)\
        .filter(Product.activity_type.notin_(ignore_activity))
    
    if product_items.count() == 0:
        node['process'].append(extract_market_process(conn, type_id, output_units))
        node['process_options'].append(extract_market_process(conn, type_id, output_units))
        return node
    
    process_items = [
        *extract_process_items(conn, product_items, station_ids),
        parse_placeholder(product_items),
    ]
    
    remaining_units = output_units
    for process in process_items:
        if process['blueprint']['bp_type'] in ['original', 'placeholder']:
            remaining_runs = inf
        elif process['blueprint']['bp_type'] == 'copy':
            remaining_runs = process['blueprint']['runs']
        elif process['blueprint']['bp_type'] == 'relic':
            remaining_runs = process['blueprint']['quantity']
            
        chance = min(1, calc_invent_chance(process['product']['probability']))
        units_per_run = process['product']['quantity'] * chance
        max_units_per_batch = process['blueprint']['max_production_limit'] * units_per_run
        while remaining_runs > 0:
            batch_units = min(remaining_units, remaining_runs * units_per_run, max_units_per_batch)
            batch_runs = batch_units / units_per_run
            batch_seconds = calc_prod_time(
                process['activity']['time'],
                process['blueprint']['time_efficiency'],
                process['station_industry'].get('strEngTimeBonus', 1),
                batch_runs,
            )
            
            node['process'].append({
                **process,
                'batch': {
                    'runs': batch_runs,
                    'chance': chance,
                    'units': batch_units,
                    'seconds': batch_seconds,
                },
            })
            
            material_items = node['process'][-1].pop('material_items')
            for material_item in material_items:
                run_mat_usage = calc_mat_needs(
                    material_item.quantity,
                    process['blueprint']['material_efficiency'],
                    process['station_industry'].get('strEngMatBonus', 1),
                    batch_runs,
                ) if process['activity']['type'] == 'manufacturing'\
                    else material_item.quantity * batch_runs
                node['materials'][material_item.type_id] = node['materials'].get(material_item.type_id, 0) + run_mat_usage
            
            remaining_units -= batch_units
            remaining_runs -= batch_runs
            if remaining_units <= 0: break
        if remaining_units <= 0: break
            
    node['process_options'] = process_items
    [process_item.pop('material_items') for process_item in node['process_options']]
    
    node['materials'] = [
        {'type_id': key, 'quantity': val}
        for key, val in node['materials'].items()
    ]
            
    return node
