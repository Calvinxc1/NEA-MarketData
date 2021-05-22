from nea_schema.maria.esi.corp import CorpAsset
from nea_schema.maria.sde.bp import Product
from nea_schema.maria.sde.inv import Type

from . import LoggingBase, parse_blueprint_item_function, parse_type_item
from .NodeExtractor import NodeExtractor

class SankeyConstructor(LoggingBase):
    def __init__(self, conn, parent=None, endpoint=False):
        self._init_logging(parent, endpoint)
        self._conn = conn
        
    def construct_sankey_items(self, type_id, output_units, station_ids, ignore_activity=['reaction']):
        nodes, links = self._build_chain_elements(type_id, output_units, station_ids, ignore_activity)
        available_materials = self._extract_available_materials(links, station_ids)
        
        nodes = [node for node in nodes.values()]
        links = [
            {**link, 'available_quantity': available_materials.get(link['type']['id'], None)}
            for link in links.values()
        ]
        
        return nodes, links
        
    def _build_chain_elements(self, type_id, output_units, station_ids, ignore_activity):
        node = NodeExtractor(self._conn).extract_node(type_id, output_units, station_ids, ignore_activity)
        nodes = {node['node_id']:node}
        links = {}
        for material in node['materials']:
            link = self._extract_link(material, node)
            links[link['link_id']] = link
            sub_nodes, sub_links = self._build_chain_elements(
                material['type_id'], material['quantity'],
                station_ids, ignore_activity,
            )
            nodes, links = self._combine_elements(nodes, links, sub_nodes, sub_links, station_ids, ignore_activity)
        return nodes, links
    
    def _combine_elements(self, current_nodes, current_links, new_nodes, new_links, station_ids, ignore_activity):
        for node_id, node in new_nodes.items():
            if node_id in current_nodes:
                new_output_units = current_nodes[node_id]['output_units'] + node['output_units']
                recalc_nodes, recalc_links = self._build_chain_elements(
                    node_id, new_output_units,
                    station_ids, ignore_activity,
                )
                new_nodes = {**new_nodes, **recalc_nodes}
                new_links = {**new_links, **recalc_links}

        nodes = {**current_nodes, **new_nodes}
        links = {**current_links, **new_links}
        return nodes, links
    
    def _extract_link(self, material, node):
        link = {
            'link_id': '{}-{}'.format(material['type_id'], node['node_id']),
            'source': material['type_id'],
            'target': node['node_id'],
            'type': parse_type_item(self._conn.query(Type).filter_by(type_id=material['type_id']).one()),
            'quantity': material['quantity'],
        }
        link['volume'] = link['quantity'] * link['type']['volume']
        return link
    
    def _extract_available_materials(self, links, station_ids, neg_displace=0.001):
        material_type_ids = [link['type']['id'] for link in links.values()]
        asset_items = self._conn.query(CorpAsset)\
            .filter(CorpAsset.type_id.in_(material_type_ids), CorpAsset.station_id.in_(station_ids))

        material_counts = {}
        for asset_item in asset_items:
            quant = asset_item.quantity
            if asset_item.blueprint:
                bp_func = parse_blueprint_item_function(asset_item.blueprint)
                if bp_func == 'bp':
                    quant = None
                elif bp_func == 'bpc':
                    quant *= asset_item.blueprint.runs

            if quant is None and material_counts.get(asset_item.type_id, 0) >= 0:
                material_counts[asset_item.type_id] = -material_counts.get(asset_item.type_id, 0) - neg_displace
            elif material_counts.get(asset_item.type_id, 0) < 0:
                material_counts[asset_item.type_id] = material_counts.get(asset_item.type_id, 0) - quant
            elif quant:
                material_counts[asset_item.type_id] = material_counts.get(asset_item.type_id, 0) + quant

        material_counts = {key:round(val) for key, val in material_counts.items()}

        return material_counts
