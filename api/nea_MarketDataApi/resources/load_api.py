from flask_restful import Api

from .resources import resources

def load_api(app, args=(), kwargs={}):
    api = Api(app)
    for resource, paths in resources.items():
        api.add_resource(resource, *paths, resource_class_args=args, resource_class_kwargs=kwargs)
        
    return api
