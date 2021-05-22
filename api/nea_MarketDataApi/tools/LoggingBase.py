from flask import request
from logging import LoggerAdapter, getLogger

class LoggingBase:
    def _init_logging(self, parent=None, endpoint=False):
        if not parent: self._task = self.__class__.__name__
        elif type(parent) is str: self._task = parent
        else: self._task = parent._task
        
        adapter = {'task': self._task}
        if endpoint:
            adapter['httpMethod'] = request.method
            adapter['httpPath'] = request.url.split('?')[0]
        else:
            adapter['httpMethod'] = '-'
            adapter['httpPath'] = '-'
        
        self._logger = LoggerAdapter(getLogger(self.__module__), adapter)
