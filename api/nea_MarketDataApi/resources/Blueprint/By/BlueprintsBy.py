from flask import request
from flask_restful import Resource

from .collect_blueprints_by import collect_blueprints_by
from ....tools import build_maria_conn

class BlueprintsBy(Resource):
    def __init__(self, logger, sql_params, verbose=False):
        self._logger = logger
        self._sql_params = sql_params
        self._verbose = verbose
        
    def get(self, by, type_id):
        parent_station_id = request.args.get('parent_station_id')
        
        conn = build_maria_conn(self._sql_params)
        blueprints = collect_blueprints_by(by, type_id, conn)
        conn.close()
        
        if parent_station_id:
            blueprints = [
                blueprint for blueprint in blueprints
                if blueprint['parent_station']['id'] == int(parent_station_id)
            ]
        
        return {'data': blueprints}, 200
