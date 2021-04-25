from flask_restful import Resource
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from ..tools import build_maria_conn

class Root(Resource):
    def __init__(self, logger, sql_params, verbose=False):
        self._logger = logger
        self._sql_params = sql_params
        self._verbose = verbose
        
    def _maria_connect(self):
        engine = create_engine('{engine}://{user}:{passwd}@{host}/{db}'.format(**self._sql_params))
        session = sessionmaker(bind=engine)
        conn = session()
        conn.execute('SET SESSION foreign_key_checks=0;')
        return conn
