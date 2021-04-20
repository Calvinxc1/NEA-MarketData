from flask import request
from flask_restful import Resource
from pandas import concat

from nea_schema.maria.sde.bp import Product
from json import dumps, loads

from .....tools import build_maria_conn
from ..parse_build_chain import parse_build_chain
from .compile_sankey_data import compile_sankey_data
from .build_sankey_blueprints import build_sankey_blueprints
from .build_missing_products import build_missing_products
from .NpEncoder import NpEncoder

class MatChainSankey(Resource):
    def __init__(self, logger, sql_params, verbose=False):
        self._logger = logger
        self._sql_params = sql_params
        self._verbose = verbose
        
    def get(self, type_id):
        type_id = int(type_id)
        output_target = int(request.args.get('output_target', '1'))
        bp_item_ids = request.args.get('bp_item_ids')
        bp_item_ids = bp_item_ids.split(',') if bp_item_ids else []
        
        conn = build_maria_conn(self._sql_params)

        product_item = conn.query(Product).filter(Product.type_id == type_id).one()
        products, materials = parse_build_chain(product_item, conn)
        missing_products = build_missing_products(products, materials)
        products = concat([products, missing_products], axis=0).reset_index(drop=True)
        products = products.merge(
            materials.groupby(['bp_type_id', 'activity_type'])['quantity'].sum().rename('incoming_mats').reset_index(),
            on=['bp_type_id', 'activity_type'], how='left',
        )
        products['incoming_mats'].fillna(0, inplace=True)

        bp_index = products.loc[products['activity_type'] == 'manufacturing', 'bp_type_id']
        blueprints = build_sankey_blueprints(bp_index, bp_item_ids, conn)

        conn.close()
        
        active_prods = products.loc[products['prod_type_id'].isin([type_id])].copy()
        active_prods['output_target'] = output_target
        
        nodes, links = compile_sankey_data(active_prods, materials, products, blueprints)
        nodes = sorted([node for node in nodes.values()], key=lambda x: x['id'])
        links = sorted(links, key=lambda x: x['mat_type_id'])
        
        nodes = loads(dumps(nodes, cls=NpEncoder))
        
        return {'data': {'nodes': nodes, 'links': links}}, 200
