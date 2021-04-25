from .parse_type import parse_type

def parse_blueprint_skill(skill_item):
    skill = {
        'type': parse_type(skill_item.type),
        'level': skill_item.level,
    }
    
    return skill
