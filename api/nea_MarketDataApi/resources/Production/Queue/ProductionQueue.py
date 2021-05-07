from bson import ObjectId
from datetime import datetime as dt
import json

from nea_schema.mongo.NewEdenAnalytics import ProductionQueue as ProductionQueueSchema

from .helpers import compile_unit_needs, extract_queue_unit_needs, parse_queue_item
from ...Root import Root

class ProductionQueue(Root):    
    def get(self, queue_id=None):
        req, data, errors = self._get_request()
        if len(errors) > 0:
            return self._build_response(req, {'errors': errors}, 400)

        station_ids = json.loads(req.parameters.query.get('station_ids', '[]'))
        self._logger.warn(station_ids)

        self._init_mongo()
        data = self._get_specific(queue_id) if queue_id\
            else self._get_list(station_ids)
            
        return self._build_response(req, {'data': data})
    
    def _get_specific(self, queue_id):
        queue_item = ProductionQueueSchema.query.get(_id=ObjectId(queue_id))
        
        conn = self._maria_connect()
        queue = parse_queue_item(queue_item, path=True)
        needs = extract_queue_unit_needs(conn, queue['path'], queue['station']['station_id'])
        needs = [need for need in needs.values()]
        conn.close()
        
        data = {'queue': queue, 'needs': needs}
        
        return data
        
    def _get_list(self, station_ids):
        query = {}
        if station_ids: query['station.station_id'] = {'$in': station_ids}
        queue_items = ProductionQueueSchema.query.find(query).all()

        conn = self._maria_connect()
        queue = [parse_queue_item(queue_item, path=False) for queue_item in queue_items]
        needs = compile_unit_needs(conn, queue_items)
        conn.close()
        
        data = {'queue': queue, 'needs': needs}

        return data
        
    def post(self):
        req, data, errors = self._get_request()
        if len(errors) > 0:
            return self._build_response(req, {'errors': errors}, 400)

        self._init_mongo()        
        record = ProductionQueueSchema(**data, created=dt.now())
        record.__mongometa__.session.flush()
        return self._build_response(req, {
            'message': 'New Production Queue item ({}) added on {}'.format(
                str(record._id),
                record.created,
            ),
            'path': '/production/queue/{}'.format(record._id),
        })
    
    def delete(self, queue_id=None):
        req, data, errors = self._get_request()
        if len(errors) > 0:
            return self._build_response(req, {'errors': errors}, 400)

        self._init_mongo()
        if queue_id:
            record = ProductionQueueSchema.query.get(_id=ObjectId(queue_id))
            record.delete()
            record.__mongometa__.session.flush()
            resp = {'message': 'Production Queue item {} deleted on {}'.format(
                str(record._id),
                dt.now(),
            )}
        else:
            queue_ids = [
                ObjectId(queue_id) for queue_id
                in json.loads(req.parameters.query.get('queue_ids'))
            ]
            ProductionQueueSchema.query.remove({'_id': {'$in': queue_ids}})
            resp = {'message': 'Deleted {} Production Queue items on {}'.format(
                len(queue_ids),
                dt.now(),
            )}

        return self._build_response(req, resp)
