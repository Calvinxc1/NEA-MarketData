import numeral from 'numeral';

const buildBlueprintInfo = (blueprint) => [{
  name: 'Material Efficiency',
  value: numeral(blueprint.material_efficiency/100).format('0%'),
},{
  name: 'Time Efficiency',
  value: numeral(blueprint.time_efficiency/100).format('0%'),
},{
  name: 'Blueprint Type',
  value: blueprint.function.charAt(0).toUpperCase() + blueprint.function.slice(1),
},{
  name: 'Quantity',
  value: blueprint.function === 'bp' ? 'N/A'
    : blueprint.function === 'bpc' ? `${numeral(blueprint.runs).format('0,0')} Runs`
    : `${numeral(blueprint.quantity).format('0,0')} Units`,
},{
  name: 'Max Productions',
  value: `${numeral(blueprint.max_production_limit).format('0,0')} Runs`,
}];

export default buildBlueprintInfo;
