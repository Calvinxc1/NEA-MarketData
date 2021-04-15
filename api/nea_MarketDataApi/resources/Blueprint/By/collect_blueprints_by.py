from nea_schema.maria.esi.corp import CorpBlueprint
from nea_schema.maria.sde.bp import Product, Material

from ..parse_blueprint import parse_blueprint
from ..get_parent_station import get_parent_station

def collect_blueprints_by(by, type_id, conn):
    if by == 'product':
        blueprint_items = conn.query(CorpBlueprint)\
            .join(Product, CorpBlueprint.type_id == Product.blueprint_id)\
            .filter(Product.type_id == type_id)
    elif by == 'material':
        blueprint_items = conn.query(CorpBlueprint)\
        .join(Material, CorpBlueprint.type_id == Material.blueprint_id)\
        .filter(Material.type_id == type_id)
    
    blueprints = {}
    for bp_item in blueprint_items:
        blueprint = parse_blueprint(bp_item)
        parent_station = get_parent_station(blueprint['location_id'], conn)
        blueprint['parent_station'] = {
            'id': int(parent_station.name),
            'name': parent_station['name'],
            'type_id': parent_station['type_id']
        }
        
        if blueprint['type_id'] not in blueprints.keys():
            blueprints[blueprint['type_id']] = {
                'type_id': blueprint['type_id'],
                'type_name': blueprint['type_name'],
                'items': [],
            }
            
        blueprints[blueprint['type_id']]['items'].append({
            'item_id': blueprint['item_id'],
            'type_id': blueprint['type_id'],
            'bp_type': blueprint['bp_type'],
            'location_id': blueprint['location_id'],
            'location_flag': blueprint['location_flag'],
            'material_efficiency': blueprint['material_efficiency'],
            'time_efficiency': blueprint['time_efficiency'],
            'runs': blueprint['runs'],
            'quantity': blueprint['quantity'],
            'parent_station': blueprint['parent_station'],
        })
        
    blueprints = [val for val in blueprints.values()]
    
    return blueprints