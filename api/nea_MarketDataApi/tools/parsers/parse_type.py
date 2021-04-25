from .parse_market_group import parse_market_group

def parse_type(type_item):
    type = {
        'id': type_item.type_id,
        'name': type_item.type_name,
        'group': {
            'id': type_item.group.group_id,
            'name': type_item.group.group_name,
            'category': {
                'id': type_item.group.category.category_id,
                'name': type_item.group.category.category_name,
            },
        },
        'market_group': parse_market_group(type_item.market_group)\
            if type_item.market_group\
            else None,
        'mass': float(type_item.mass) if type_item.mass else type_item.mass,
        'volume': type_item.volume,
        'portion_size': type_item.portion_size,
    }
    
    return type
