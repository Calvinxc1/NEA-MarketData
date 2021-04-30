from pandas import concat

def parse_bp_locs(rows, locations, blueprints, root_loc=None):
    final_locs = []
    for _, row in rows.reset_index().iterrows():
        location = row.to_dict()
        pass_loc = root_loc if root_loc else location['name']
        
        if row['type_id'] == 27:
            office_locs = locations.loc[locations['location_id'] == location['id']]
            office_bps = blueprints.loc[blueprints['location_id'] == location['id']]
            divisions = concat([office_locs['location_flag'], office_bps['location_flag']])\
                .drop_duplicates().sort_values()
            
            for division in divisions:
                div_number = int(division[-1])
                location['id'] = '{}-{}'.format(location['id'], div_number)
                location['name'] = 'Office Division {}'.format(div_number)
                
                location['blueprints'] = [
                    row.to_dict() for _, row
                    in office_bps.loc[office_bps['location_flag'] == division].iterrows()
                ]
                
                child_locations = office_locs.loc[office_locs['location_flag'] == division]
                location['children'] = parse_bp_locs(child_locations, locations, blueprints, pass_loc)
                location['bp_count'] = location['bp_count'] = len(location['blueprints'])\
                    + sum([child['bp_count'] for child in location['children']])
                
                final_locs.append(location)
                
        else:
            location['blueprints'] = [
                row.to_dict() for _, row
                in blueprints.loc[blueprints['location_id'] == location['id']].iterrows()
            ]
            
            child_locations = locations.loc[locations['location_id'] == location['id']]
            location['children'] = parse_bp_locs(child_locations, locations, blueprints, pass_loc)

            location['bp_count'] = location['bp_count'] = len(location['blueprints'])\
                    + sum([child['bp_count'] for child in location['children']])

            final_locs.append(location)
        
    return final_locs
