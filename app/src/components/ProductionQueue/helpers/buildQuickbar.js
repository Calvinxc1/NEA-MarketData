const buildQuickbar = (listName, needs) => {
  const quickbarMaterials = needs.filter((need) => need.process[0].activity.type === 'purchase')
    .map((need) => `- ${need.type.name} [${need.units}]`);
  const quickbar = [`+ ${listName}`, ...quickbarMaterials];
  return quickbar;
};

export default buildQuickbar;
