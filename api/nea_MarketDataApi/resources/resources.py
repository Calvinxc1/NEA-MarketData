from ..resources.Blueprint import BlueprintItem, BlueprintLocation
from ..resources.Production import ProductionChain, ProductionQueue, ProductionQueuePriority
from ..resources.Station import Station

resources = {
    BlueprintItem: ['/blueprint/item/<item_id>'],
    BlueprintLocation: ['/blueprint/location', '/blueprint/location/<location_id>'],
    ProductionChain: ['/production/chain/<type_id>'],
    ProductionQueue: ['/production/queue', '/production/queue/<queue_id>'],
    ProductionQueuePriority: ['/production/queue/priority'],
    Station: ['/station'],
}
