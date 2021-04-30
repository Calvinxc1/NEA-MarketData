from .....tools.parsers import parse_blueprint_material
from ...helpers import calc_mat_needs

def parse_link(material_item, node):
    link = {
        'link_id': '{}-{}'.format(material_item.type_id, node['node_id']),
        'source': material_item.type_id,
        'target': node['node_id'],
        'material': parse_blueprint_material(material_item),
        'target_runs': node['output_runs'],
        'target_me': node['items']['options'].get(node['items']['selected'], {}).get('material_efficiency', 0),
        'target_process': node['activity']['type'],
    }
    
    link['units'] = calc_mat_needs(
        link['material']['quantity'],
        link['target_me'],
        link['target_runs'],
    ) if link['target_process'] == 'manufacturing'\
        else link['material']['quantity'] * link['target_runs']
    
    return link
