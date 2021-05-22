class CopyProduct:
    def __init__(self, activity_item):
        self.blueprint_id = activity_item.blueprint_id
        self.activity = activity_item
        self.quantity = 1
        self.probability = 1
        self.type = activity_item.blueprint.type
