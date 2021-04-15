from nea_schema.maria.esi.corp import CorpBlueprint

from .parse_blueprint import parse_blueprint
from .get_parent_station import get_parent_station

def collect_blueprint(item_id, conn):
    bp_item = conn.query(CorpBlueprint).filter(CorpBlueprint.item_id == item_id).one()
    blueprint = parse_blueprint(bp_item)
    
    parent_station = get_parent_station(blueprint['location_id'], conn)
    blueprint['parent_station'] = {
        'id': int(parent_station.name),
        'name': parent_station['name'],
        'type_id': parent_station['type_id']
    }
    
    return blueprint
