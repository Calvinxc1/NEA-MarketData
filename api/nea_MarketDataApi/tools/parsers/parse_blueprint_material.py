from .parse_type import parse_type

def parse_blueprint_material(material_item):
    material = {
        'type': parse_type(material_item.type),
        'quantity': material_item.quantity,
    }
    
    return material
