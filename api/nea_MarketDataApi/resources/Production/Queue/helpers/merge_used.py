def merge_used(used_1, used_2):
    used = {**used_1}
    for key, val in used_2.items():
        used[key] = {
            'type': val['type'],
            'units': {
                sub_key:used.get(key, {}).get('units', {}).get(sub_key, 0) + val['units'][sub_key]
                for sub_key in ['asset', 'industry']
            },
        }
    return used
