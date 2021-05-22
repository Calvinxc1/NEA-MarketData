from flask import Flask
import json
import logging
from openapi_core import create_spec
from pathlib import Path

from config.config import sql_params, mongo_params
from .resources import load_api
from .tools import init_root_logger

app = Flask(__name__)
logger = init_root_logger()

kwargs = {
    'spec': create_spec(json.load(Path('./spec.json').open())),
    'sql_params': sql_params,
    'mongo_params': mongo_params,
    'diag': False,
}

api = load_api(app, kwargs=kwargs)
