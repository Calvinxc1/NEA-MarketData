from .parse_material import parse_material
from .parse_product import parse_product
from .parse_skill import parse_skill

def parse_activity(activity_item):
    activity = {
        'activity_type': activity_item.activity_type,
        'time': activity_item.time,
        'materials': [
            parse_material(material_item)
            for material_item in activity_item.material
        ],
        'products': [
            parse_product(product_item)
            for product_item in activity_item.product
        ],
        'skills': [
            parse_skill(skill_item)
            for skill_item in activity_item.skill
        ],
    }
    
    return activity
