def merge_needs(needs_1, needs_2):
    needs = {**needs_1}
    for key, val in needs_2.items():
        needs[key] = {
            'type': val['type'],
            'units': {
                **val['units'],
                'needed': needs.get(key, {}).get('units', {}).get('needed', 0) + val['units']['needed'],
            },
            'process': needs.get(key, {}).get('process', []) + val['process'],
        }
    return needs
