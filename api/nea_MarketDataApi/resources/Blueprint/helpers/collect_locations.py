from .get_locations import get_locations

def collect_locations(location_ids, conn):
    locations = get_locations(location_ids, conn)
    while len(location_ids) > 0:
        location_mask = ~locations['location_id'].isin(locations.index)\
            & ~locations['location_type'].isin(['system'])

        location_ids = [
            int(val) for val
            in locations.loc[location_mask, 'location_id']
        ]

        locations = locations.append(get_locations(location_ids, conn))
    
    return locations
