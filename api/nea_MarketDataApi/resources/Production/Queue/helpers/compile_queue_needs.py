from .extract_queue_unit_needs import extract_queue_unit_needs
from .merge_needs import merge_needs
from .merge_used import merge_used
from .parse_queue_item import parse_queue_item

def compile_queue_needs(conn, queue_items):
    queues = []
    needs = {}
    used = {}
    for queue_item in queue_items:
        queue = parse_queue_item(queue_item, path=True)
        queue_path = queue.pop('path')
        need, use = extract_queue_unit_needs(conn, queue_path, queue['station']['station_id'], prior_used=used)
        queue = {
            **queue,
            'units': queue_path['units'],
            'process': queue_path['process'],
            'type': queue_path['type'],
            'needs': [n for n in need.values()],
            'used': [u for u in use.values()],
        }
        queues.append(queue)
        needs = merge_needs(needs, need)
        used = merge_used(used, use)
    
    needs = [n for n in needs.values()]
    used = [u for u in used.values()]
    return queues, needs, used
