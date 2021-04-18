from json import JSONEncoder
from numpy import integer, floating, ndarray

class NpEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, integer):
            return int(obj)
        elif isinstance(obj, floating):
            return float(obj)
        elif isinstance(obj, ndarray):
            return obj.tolist()
        else:
            return super(NpEncoder, self).default(obj)
