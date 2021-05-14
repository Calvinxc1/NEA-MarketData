from .extract_units_avail import extract_units_avail
from .merge_needs import merge_needs
from .merge_used import merge_used
from .reparse_process import reparse_process

def extract_queue_unit_needs(conn, path, station_id, units_required=None, prior_used={}):
    if units_required is None: units_required = path.units
    units_avail = extract_units_avail(
        conn, path.type.id, station_id,
        prior_used.get(path.type.id, {}).get('units', {})
    )
    units_needed = max(0, units_required - units_avail['total'])
    
    needs = {}
    used = {}
    if units_avail['total'] > 0:
        used[path.type.id] = {
            'type': path.type,
            'units': {
                'asset': min(units_required, units_avail['asset']),
                'industry': min(max(units_required - units_avail['asset'], 0), units_avail['industry']),
            },
        }
    
    if units_needed == 0: return needs, used
    
    component_usage = {}
    if units_avail['total'] > 0:
        for process in reparse_process(path, units_needed):
            for material in process['materials']:
                component_usage[material['type']['id']] = component_usage.get(material['type']['id'], 0) + material['usage']
    
    for component_path in path.components:
        sub_needs, sub_used = extract_queue_unit_needs(
            conn, component_path, station_id,
            component_usage.get(component_path.type.id),
            merge_used(prior_used, used),
        )
        needs = merge_needs(needs, sub_needs)
        used = merge_used(used, sub_used)
    
    if len(needs) == 0:
        needs[path.type.id] = {
            'type': path.type,
            'units': units_needed,
            'process': reparse_process(path, units_needed),
        }
    
    return needs, used
