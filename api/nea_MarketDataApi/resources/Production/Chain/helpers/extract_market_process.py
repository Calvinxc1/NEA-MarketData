from nea_schema.maria.sde.inv import Type

from .....tools.parsers import parse_type

def extract_market_process(conn, type_id, output_units):
    process = {
        'product': {
            'type': parse_type(conn.query(Type).filter_by(type_id=type_id).one()),
            'quantity': 1,
            'probability': 1,
        },
        'activity': {'type': 'purchase', 'time': 0},
        'batch': {'runs': output_units, 'units': output_units, 'seconds': 0},
    }
    return process
