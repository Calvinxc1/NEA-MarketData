from nea_schema.mongo.NewEdenAnalytics import ProductionQueue as ProductionQueueSchema

from .compile_queue_needs import compile_queue_needs
from .extract_queue_unit_needs import extract_queue_unit_needs
from .parse_queue_item import parse_queue_item

def compile_single_queue(conn, queue_item):
    query = {
        'station.station_id': queue_item.station.station_id,
        'priority': {'$lt': queue_item.priority}
    }
    queue_items = ProductionQueueSchema.query.find(query).sort('priority')
    
    _, _, prior_used = compile_queue_needs(conn, queue_items)
    queue = parse_queue_item(queue_item, path=True)
    needs, used = extract_queue_unit_needs(conn, queue['path'], queue['station']['station_id'], units_used=prior_used)
    return queue, needs, used
