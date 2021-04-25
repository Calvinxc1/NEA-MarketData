from .parse_type import parse_type

def parse_blueprint_product(product_item):
    product = {
        'type': parse_type(product_item.type),
        'quantity': product_item.quantity,
        'probability': product_item.probability,
    }
    
    return product
