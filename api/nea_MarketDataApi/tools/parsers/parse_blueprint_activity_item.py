from .parse_blueprint_material_item import parse_blueprint_material_item
from .parse_blueprint_product_item import parse_blueprint_product_item
from .parse_blueprint_skill_item import parse_blueprint_skill_item

def parse_blueprint_activity_item(activity_item):
    activity = {
        'activity_type': activity_item.activity_type,
        'time': activity_item.time,
        'materials': [
            parse_blueprint_material_item(material_item)
            for material_item in activity_item.material
        ],
        'products': [
            parse_blueprint_product_item(product_item)
            for product_item in activity_item.product
        ],
        'skills': [
            parse_blueprint_skill_item(skill_item)
            for skill_item in activity_item.skill
        ],
    }
    
    return activity
