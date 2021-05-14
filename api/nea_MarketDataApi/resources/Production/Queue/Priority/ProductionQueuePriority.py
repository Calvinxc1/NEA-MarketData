from bson import ObjectId
from datetime import datetime as dt
import json

from nea_schema.mongo.NewEdenAnalytics import ProductionQueue as ProductionQueueSchema

from ....Root import Root

class ProductionQueuePriority(Root):
    def put(self):
        req, data, errors = self._get_request()
        if len(errors) > 0:
            return self._build_response(req, {'errors': errors}, 400)
        
        self._init_mongo()
        priorities = [ObjectId(queue_id) for queue_id in data]
        
        for i, queue_id in enumerate(priorities):
            queue_item = ProductionQueueSchema.query.get(_id=queue_id)
            queue_item.priority = i
            queue_item.__mongometa__.session.flush()
            
        queue_items = ProductionQueueSchema.query.find({'_id': {'$nin': priorities}}).sort('priority')
        for i, queue_item in enumerate(queue_items, i+1):
            queue_item.priority = i
            queue_item.__mongometa__.session.flush()
            
        resp = {'message': 'Production Queue priorities updated on {}'.format(dt.now())}
        return self._build_response(req, resp)
