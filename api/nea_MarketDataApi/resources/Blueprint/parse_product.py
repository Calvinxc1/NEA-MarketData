def parse_product(product_item):
    product = {
        'type_id': product_item.type_id,
        'type_name': product_item.type.type_name,
        'quantity': product_item.quantity,
        'probability': product_item.probability,
    }
    
    return product
