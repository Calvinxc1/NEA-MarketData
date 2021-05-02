from flask import Flask
from flask_restful import Api
import logging
from openapi_core import create_spec
from openapi_spec_validator.schemas import read_yaml_file
from pathlib import Path

from .resources.Blueprint import BlueprintItem, BlueprintLocation
from .resources.Production import ProductionChain
from config.config import sql_params

app = Flask(__name__)
api = Api(app)

gunicorn_logger = logging.getLogger('gunicorn.error')
app.logger.handlers = gunicorn_logger.handlers
app.logger.setLevel(gunicorn_logger.level)

spec_path = Path('./spec.yml')
spec = create_spec(read_yaml_file(spec_path))

kwargs = {
    'logger': gunicorn_logger,
    'spec': spec,
    'sql_params': sql_params,
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
