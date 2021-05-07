def parse_queue_item(queue_item, path=True):
    queue = {
        'id': str(queue_item._id),
        'created': queue_item.created,
        'station': queue_item.station,
    }
    
    if path:
        queue['path'] = queue_item.path
    else:
        queue['units'] = queue_item.path['units']
        queue['type'] = queue_item.path['type']
        queue['process'] = queue_item.path['process']
        
    return queue
