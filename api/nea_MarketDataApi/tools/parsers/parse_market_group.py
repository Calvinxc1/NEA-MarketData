def parse_market_group(market_group_item):
    market_group = {
        'id': market_group_item.market_group_id,
        'name': market_group_item.market_group_name,
    }
    if market_group_item.parent_group_id:
        market_group['parent'] = parse_market_group(market_group_item.parent_group)
        
    return market_group
