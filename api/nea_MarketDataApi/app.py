from flask import Flask
from flask_restful import Api
import logging
import json
from openapi_core import create_spec
from pathlib import Path

from .resources.Blueprint import BlueprintItem, BlueprintLocation
from .resources.Production import ProductionChain, ProductionQueue, ProductionQueuePriority
from .resources.Station import Station
from config.config import sql_params, mongo_params

app = Flask(__name__)
api = Api(app)

gunicorn_logger = logging.getLogger('gunicorn.error')
app.logger.handlers = gunicorn_logger.handlers
app.logger.setLevel(gunicorn_logger.level)

spec_path = Path('./spec.json')
spec = create_spec(json.load(spec_path.open()))

kwargs = {
    'logger': gunicorn_logger,
    'spec': spec,
    'sql_params': sql_params,
    'mongo_params': mongo_params,
    'diag': False,
}

api.add_resource(
    BlueprintItem,
    '/blueprint/item/<item_id>',
    resource_class_kwargs=kwargs,
)
api.add_resource(
    BlueprintLocation,
    '/blueprint/location', '/blueprint/location/<location_id>',
    resource_class_kwargs=kwargs,
)
api.add_resource(
    ProductionChain,
    '/production/chain/<type_id>',
    resource_class_kwargs=kwargs,
)
api.add_resource(
    ProductionQueue,
    '/production/queue', '/production/queue/<queue_id>',
    resource_class_kwargs=kwargs,
)
api.add_resource(
    ProductionQueuePriority,
    '/production/queue/priority',
    resource_class_kwargs=kwargs,
)
api.add_resource(
    Station,
    '/station',
    resource_class_kwargs=kwargs,
)
