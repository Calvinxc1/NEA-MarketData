from .extract_units_avail import extract_units_avail

def extract_queue_unit_needs(conn, path, station_id):
    needs = {}
    
    units_avail = extract_units_avail(conn, path.type.id, station_id)
    units_needed = path.units - units_avail
    if units_needed <= 0: return needs
    
    for component_path in path.components:
        sub_needs = extract_queue_unit_needs(conn, component_path, station_id)
        for key, val in sub_needs.items():
            current_units = needs.get(key, {}).get('units', {}).get('required', 0)
            needs[key] = val
            needs[key]['units']['required'] += current_units
            needs[key]['units']['needed'] = needs[key]['units']['required']\
                - needs[key]['units']['available']
    
    if len(needs) == 0:
        needs[path.type.id] = {
            'type': path.type,
            'units': {
                'required': path.units,
                'available': units_avail,
                'needed': units_needed,
            },
            'process': path.process,
        }
    
    return needs
