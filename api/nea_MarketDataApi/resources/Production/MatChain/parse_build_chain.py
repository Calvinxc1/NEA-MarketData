from pandas import DataFrame, concat

from nea_schema.maria.sde.bp import Product
from .build_items import build_mat_node, build_prod_node, build_invent_mat, build_copy_prod

def parse_build_chain(product_item, conn):
    products = [build_prod_node(product_item, 'manufacturing')]
    materials = [build_mat_node(material, 'manufacturing') for material in product_item.activity.material]
        
    invent_product_items = conn.query(Product).filter(Product.type_id == product_item.blueprint_id)
    for invent_product_item in invent_product_items:
        if invent_product_item.activity.activity_type == 'reaction': continue
        
        products.append(build_prod_node(invent_product_item, 'invention'))
        materials.extend([build_mat_node(material, 'invention') for material in invent_product_item.activity.material])
        
        products.append(build_copy_prod(invent_product_item))
        materials.append(build_invent_mat(invent_product_item))
        
        copy_activity = [
            activity for activity in invent_product_item.activity.blueprint.activity
            if activity.activity_type == 'copying'
        ][0]
        materials.extend([build_mat_node(material, 'copying') for material in copy_activity.material])
        
    products = [DataFrame(products)]
    materials = [DataFrame(materials)]
        
    sub_product_items = conn.query(Product).filter(Product.type_id.in_(materials[0]['mat_type_id']))
    for sub_product_item in sub_product_items:
        if sub_product_item.activity.activity_type == 'reaction': continue
        sub_products, sub_materials = parse_build_chain(sub_product_item, conn)
        products.append(sub_products)
        materials.append(sub_materials)
        
    products = concat(products, axis=0).reset_index(drop=True)
    materials = concat(materials, axis=0).reset_index(drop=True)
        
    return products, materials
