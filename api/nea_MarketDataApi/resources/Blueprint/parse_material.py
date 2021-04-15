from nea_schema.maria.sde.bp import Product
from nea_schema.maria.esi.corp import CorpBlueprint

def parse_material(material_item):
    material = {
        'type_id': material_item.type_id,
        'type_name': material_item.type.type_name,
        'quantity': material_item.quantity,
    }
    
    return material
