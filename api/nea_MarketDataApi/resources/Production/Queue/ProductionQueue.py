from bson import ObjectId
from datetime import datetime as dt
import json

from nea_schema.mongo.NewEdenAnalytics import ProductionQueue as ProductionQueueSchema

from .helpers import compile_queue_needs, compile_single_queue
from ...Root import Root

class ProductionQueue(Root):    
    def get(self, queue_id=None):
        req, data, errors = self._get_request()
        if len(errors) > 0:
            return self._build_response(req, {'errors': errors}, 400)

        station_ids = json.loads(req.parameters.query.get('station_ids', '[]'))

        self._init_mongo()
        data = self._get_specific(queue_id) if queue_id\
            else self._get_list(station_ids)
            
        return self._build_response(req, {'data': data})
    
    def _get_specific(self, queue_id):
        queue_item = ProductionQueueSchema.query.get(_id=ObjectId(queue_id))
        
        conn = self._maria_connect()
        queue, needs, used = compile_single_queue(conn, queue_item)
        conn.close()
        
        data = {'queue': queue, 'needs': needs, 'used': used}
        
        return data
        
    def _get_list(self, station_ids):
        query = {}
        if station_ids: query['station.station_id'] = {'$in': station_ids}
        queue_items = ProductionQueueSchema.query.find(query).sort('priority')

        conn = self._maria_connect()
        queues, needs, used = compile_queue_needs(conn, queue_items)
        conn.close()
        
        data = {'queues': queues, 'needs': needs, 'used': used}
        return data
        
    def post(self):
        req, data, errors = self._get_request()
        if len(errors) > 0:
            return self._build_response(req, {'errors': errors}, 400)

        self._init_mongo()
        priority = ProductionQueueSchema.query.find().count()
        record = ProductionQueueSchema(**data, priority=priority, created=dt.now())
        record.__mongometa__.session.flush()
        resp = {
            'message': 'New Production Queue item ({}) added on {}'.format(
                str(record._id),
                record.created,
            ),
            'path': '/production/queue/{}'.format(record._id),
        }
        return self._build_response(req, resp)
    
    def put(self, queue_id):
        req, data, errors = self._get_request()
        if len(errors) > 0:
            return self._build_response(req, {'errors': errors}, 400)
            
        resp = {'message': 'Placeholder for future endpoint'}
        return self._build_response(req, resp)
    
    def delete(self, queue_id=None):
        req, data, errors = self._get_request()
        if len(errors) > 0:
            return self._build_response(req, {'errors': errors}, 400)

        self._init_mongo()
        resp = self._delete_single(queue_id)
        return self._build_response(req, resp)
    
    def _delete_single(self, queue_id):
        record_item = ProductionQueueSchema.query.get(_id=ObjectId(queue_id))
        record_items = ProductionQueueSchema.query.find({'priority': {'$gt': record_item.priority}})
        record_item.delete()
        resp = {'message': 'Production Queue item {} deleted on {}'.format(
            str(record_item._id),
            dt.now(),
        )}
        record_item.__mongometa__.session.flush()

        for record_item in record_items:
            record_item.priority -= 1
            record_item.__mongometa__.session.flush()
            
        return resp
