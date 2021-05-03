from numpy import inf

def build_blueprint_queue(blueprints, remaining_units):
    blueprint_queue = []
    for blueprint in blueprints:
        remaining_runs = blueprint['runs'] if blueprint['runs'] > 0 else inf
        mean_units_per_run = blueprint['product']['quantity'] * blueprint['product']['probability']
        max_units_per_batch = blueprint['max_production_limit'] * mean_units_per_run
        while remaining_runs > 0:
            batch_units = min(remaining_units, remaining_runs * mean_units_per_run, max_units_per_batch)
            batch_runs = batch_units / mean_units_per_run
            blueprint_queue.append({
                **blueprint,
                'batch_runs': batch_runs,
                'batch_units': batch_units,
            })
            remaining_units -= batch_units
            remaining_runs -= batch_runs
            if remaining_units <= 0: break
        if remaining_units <= 0: break
            
    return blueprint_queue
