def parse_skill(skill_item):
    skill = {
        'type_id': skill_item.type_id,
        'type_name': skill_item.type.type_name,
        'level': skill_item.level,
    }
    
    return skill
