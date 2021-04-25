from flask import Flask
from flask_restful import Api
import logging

from .resources.Blueprint.Item import BlueprintItem
from .resources.Location.Blueprint import BlueprintLocation
from config.config import sql_params

app = Flask(__name__)
api = Api(app)

gunicorn_logger = logging.getLogger('gunicorn.error')
app.logger.handlers = gunicorn_logger.handlers
app.logger.setLevel(gunicorn_logger.level)

api.add_resource(
    BlueprintItem,
    '/blueprint/item/<item_id>',
    resource_class_args=[gunicorn_logger, sql_params],
)
api.add_resource(
    BlueprintLocation,
    '/location/blueprint', '/location/blueprint/<location_id>',
    resource_class_args=[gunicorn_logger, sql_params],
)
