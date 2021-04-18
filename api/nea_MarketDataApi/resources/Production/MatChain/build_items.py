from pandas import Series

def build_mat_node(material, activity_type):
    mat_node = Series({
        'bp_type_id': material.blueprint_id,
        'activity_type': activity_type,
        'mat_type_id': material.type_id,
        'mat_type_name': material.type.type_name,
        'quantity': material.quantity,
    })
    return mat_node

def build_prod_node(product, activity_type):
    prod_node = Series({
        'bp_type_id': product.blueprint_id,
        'bp_type_name': product.activity.blueprint.type.type_name,
        'activity_type': activity_type,
        'prod_type_id': product.type_id,
        'prod_type_name': product.type.type_name,
        'quantity': product.quantity,
        'probability': product.probability,
    })
    return prod_node

def build_invent_mat(invent_prod):
    mat_node = Series({
        'bp_type_id': invent_prod.blueprint_id,
        'activity_type': 'invention',
        'mat_type_id': invent_prod.blueprint_id,
        'mat_type_name': invent_prod.activity.blueprint.type.type_name,
        'quantity': 1,
    })
    return mat_node

def build_copy_prod(invent_prod):
    prod_node = Series({
        'bp_type_id': invent_prod.blueprint_id,
        'bp_type_name': invent_prod.activity.blueprint.type.type_name,
        'activity_type': 'copying',
        'prod_type_id': invent_prod.blueprint_id,
        'prod_type_name': invent_prod.activity.blueprint.type.type_name,
        'quantity': 1,
        'probability': 1.0,
    })
    return prod_node
