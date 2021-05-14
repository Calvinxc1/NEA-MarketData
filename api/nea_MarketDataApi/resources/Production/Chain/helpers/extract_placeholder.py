from numpy import inf

from nea_schema.maria.sde.bp import Product

from .parse_placeholder import parse_placeholder

def extract_placeholder(conn, product_items, invented=False):
    placeholder = {}
    for product_item in product_items:
        invented = conn.query(Product).filter_by(type_id=product_item.blueprint_id).count() > 0
        new_placeholder = parse_placeholder(product_item, invented)
        if new_placeholder['efficiency_ratio'] > placeholder.get('efficiency_ratio', -inf):
            placeholder = new_placeholder
    
    return placeholder
