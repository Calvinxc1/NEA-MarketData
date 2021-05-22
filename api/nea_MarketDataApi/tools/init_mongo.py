import ming

def init_mongo(mongo_params):
    mongo_uri = 'mongodb://{username}:{password}@{host}/{database}'.format(**mongo_params)
    ming.config.configure_from_nested_dict({'NewEdenAnalytics': {'uri': mongo_uri}})
