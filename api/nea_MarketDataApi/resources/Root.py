from flask import make_response, request
from flask_restful import Resource
import json
import ming
from openapi_core.validation.request.validators import RequestValidator
from openapi_core.validation.response.validators import ResponseValidator
from openapi_core.contrib.flask import FlaskOpenAPIRequest, FlaskOpenAPIResponse
from openapi_core.schema.media_types.exceptions import InvalidContentType
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from ..tools import build_maria_conn

class Root(Resource):
    def __init__(self, logger, spec, sql_params, mongo_params, diag=False):
        self._logger = logger
        self._spec = spec
        self._sql_params = sql_params
        self._mongo_params = mongo_params
        self._diag = diag
    
    def _init_mongo(self):
        mongo_uri = 'mongodb://{username}:{password}@{host}/{database}'.format(**self._mongo_params)
        ming.config.configure_from_nested_dict({'NewEdenAnalytics': {'uri': mongo_uri}})
        
    def _maria_connect(self):
        engine = create_engine('{engine}://{user}:{passwd}@{host}/{db}'.format(**self._sql_params))
        session = sessionmaker(bind=engine)
        conn = session()
        conn.execute('SET SESSION foreign_key_checks=0;')
        return conn
    
    def _get_request(self):
        req = FlaskOpenAPIRequest(request)
        validation = RequestValidator(self._spec).validate(req)
        
        errors = [str(error) for error in validation.errors]
        
        if errors: self._logger.warn(errors)
        
        if req.body:
            data = json.loads(req.body)\
                if len(errors) == 0 else None
        else:
            data = None
        
        return req, data, errors
    
    def _build_response(self, req, body, status=200, headers={}):
        resp = make_response(body, status, headers)
        if self._diag:
            validation = ResponseValidator(self._spec).validate(req, FlaskOpenAPIResponse(resp))
            validation.raise_for_errors()
        return resp
