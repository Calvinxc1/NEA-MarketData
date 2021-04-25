from .parse_blueprint_material import parse_blueprint_material
from .parse_blueprint_product import parse_blueprint_product
from .parse_blueprint_skill import parse_blueprint_skill

def parse_blueprint_activity(activity_item):
    activity = {
        'activity_type': activity_item.activity_type,
        'time': activity_item.time,
        'materials': [
            parse_blueprint_material(material_item)
            for material_item in activity_item.material
        ],
        'products': [
            parse_blueprint_product(product_item)
            for product_item in activity_item.product
        ],
        'skills': [
            parse_blueprint_skill(skill_item)
            for skill_item in activity_item.skill
        ],
    }
    
    return activity
