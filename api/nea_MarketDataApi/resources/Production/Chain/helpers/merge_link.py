from ...helpers import calc_mat_needs

def merge_link(links, link):
    if link['link_id'] in links.keys():
        link = {**link}
        link['target_runs'] += links[link['link_id']]['target_runs']
        link['units'] += links[link['link_id']]['units']
    
    nodes = {**links, link['link_id']: link}
    return nodes
