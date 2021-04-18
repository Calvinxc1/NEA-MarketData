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
            filtered_blueprints = []
            for blueprint in blueprints:
                blueprint['items'] = [
                    bp_item for bp_item in blueprint['items']
                    if bp_item['parent_station']['id'] == int(parent_station_id)
                ]
                
                if len(blueprint['items']) > 0:
                    filtered_blueprints.append(blueprint)
                
            blueprints = filtered_blueprints
        
        return {'data': blueprints}, 200
