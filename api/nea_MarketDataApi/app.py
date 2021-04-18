from flask import Flask
from flask_restful import Api
import logging

from .resources.Blueprint import Blueprint
from .resources.Blueprint.By import BlueprintsBy
from .resources.Production.MatChain.Sankey import MatChainSankey
from config.config import sql_params

app = Flask(__name__)
api = Api(app)

gunicorn_logger = logging.getLogger('gunicorn.error')
app.logger.handlers = gunicorn_logger.handlers
app.logger.setLevel(gunicorn_logger.level)

api.add_resource(
    Blueprint,
    '/blueprint', '/blueprint/<item_id>',
    resource_class_args=[gunicorn_logger, sql_params],
)
api.add_resource(
    BlueprintsBy,
    '/blueprint/by/<by>/<type_id>',
    resource_class_args=[gunicorn_logger, sql_params],
)
api.add_resource(
    MatChainSankey,
    '/production/matChain/<type_id>/sankey',
    resource_class_args=[gunicorn_logger, sql_params],
)
