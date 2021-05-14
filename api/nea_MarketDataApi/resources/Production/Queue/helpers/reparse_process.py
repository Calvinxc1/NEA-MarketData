from ...helpers import calc_mat_needs
from .....tools.parsers import parse_type

def reparse_process(path, units_needed):
    new_process = []
    
    unit_tally = units_needed
    for process in path.process:
        if unit_tally <= 0: break
        
        if 0 < unit_tally < process.batch.units:
            process = {
                **process,
                'batch': {
                    **process.batch,
                    'runs': min(
                        unit_tally / (process.product.quantity * process.product.probability),
                        process.batch.units,
                    ),
                    'units': unit_tally,
                },
            }

            process['materials'] = [{
                **material,
                'usage': calc_mat_needs(
                    material.quantity,
                    process['blueprint']['material_efficiency'],
                    process['station_industry'].get('strEngMatBonus', 1),
                    process['batch']['runs'],
                    process['activity']['type'],
                ),
            } for material in process.get('materials', [])]

        new_process.append(process)
        unit_tally -= new_process[-1]['batch']['units']
        
    return new_process
