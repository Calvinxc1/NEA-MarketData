def parse_bp_locs(rows, locations, blueprints):
    bp_locs = []
    for _, row in rows.reset_index().iterrows():
        location = row.to_dict()
        
        location['blueprints'] = blueprints.loc[blueprints['location_id'] == location['id']]
        location['blueprints'] = [row.to_dict() for _, row in location['blueprints'].reset_index().iterrows()]
        
        child_locations = locations.loc[locations['location_id'] == location['id']]
        location['children'] = parse_bp_locs(child_locations, locations, blueprints)
        
        bp_locs.append(location)
        
    return bp_locs
