from .parse_type_item import parse_type_item

def parse_blueprint_material_item(material_item):
    material = {
        'type': parse_type_item(material_item.type),
        'quantity': material_item.quantity,
    }
    
    return material
