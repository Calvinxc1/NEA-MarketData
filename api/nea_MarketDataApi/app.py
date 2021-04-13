from flask import Flask
from flask_restful import Api

from .resources.blueprints.locations import BlueprintLocations
from config.config import sql_params

app = Flask(__name__)
api = Api(app)

api.add_resource(
    BlueprintLocations, '/blueprints/locations',
    resource_class_args=[sql_params],
)
