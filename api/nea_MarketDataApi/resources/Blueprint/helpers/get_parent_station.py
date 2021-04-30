from .get_locations import get_locations

def get_parent_station(loc_id, conn):
    parent_loc = get_locations([loc_id], conn).iloc[0]
    while parent_loc['location_type'] != 'system':
        parent_loc = get_locations([parent_loc['location_id']], conn).iloc[0]
    return parent_loc
