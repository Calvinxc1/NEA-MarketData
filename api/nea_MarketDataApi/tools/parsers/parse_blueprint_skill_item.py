from .parse_type_item import parse_type_item

def parse_blueprint_skill_item(skill_item):
    skill = {
        'type': parse_type_item(skill_item.type),
        'level': skill_item.level,
    }
    
    return skill
