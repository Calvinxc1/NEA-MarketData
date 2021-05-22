from .parse_type_item import parse_type_item

def parse_blueprint_product_item(product_item):
    product = {
        'type': parse_type_item(product_item.type),
        'quantity': product_item.quantity,
        'probability': product_item.probability,
    }
    
    return product
