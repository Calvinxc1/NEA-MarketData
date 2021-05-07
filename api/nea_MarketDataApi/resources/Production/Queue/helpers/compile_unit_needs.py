from .extract_queue_unit_needs import extract_queue_unit_needs

def compile_unit_needs(conn, queue_items):
    unit_needs = {}
    for queue_item in queue_items:
        queue_unit_needs = extract_queue_unit_needs(conn, queue_item.path, queue_item.station.station_id)
        for key, val in queue_unit_needs.items():
            current_units = unit_needs.get(key, {}).get('units', {}).get('required', 0)
            unit_needs[key] = val
            unit_needs[key]['units']['required'] += current_units
            unit_needs[key]['units']['needed'] = unit_needs[key]['units']['required']\
                - unit_needs[key]['units']['available']
            
    unit_needs = [val for val in unit_needs.values()]
    return unit_needs
