from nea_schema.maria.sde.inv import Type

from .....tools.parsers import parse_type

def extract_link(conn, material, node):
    link = {
        'link_id': '{}-{}'.format(material['type_id'], node['node_id']),
        'source': material['type_id'],
        'target': node['node_id'],
        'type': parse_type(conn.query(Type).filter_by(type_id=material['type_id']).one()),
        'quantity': material['quantity'],
    }
    return link
