import numeral from 'numeral';

const buildBlueprintInfo = (blueprint) => [{
  name: 'Material Efficiency',
  value: numeral(blueprint.material_efficiency/100).format('0%'),
},{
  name: 'Time Efficiency',
  value: numeral(blueprint.time_efficiency/100).format('0%'),
},{
  name: 'Blueprint Type',
  value: blueprint.bp_type.charAt(0).toUpperCase() + blueprint.bp_type.slice(1),
},{
  name: 'Quantity',
  value: blueprint.bp_type === 'copy' ? `${numeral(blueprint.runs).format('0,0')} Runs`
    : blueprint.quantity === 0 ? 'N/A'
    : `${numeral(blueprint.quantity).format('0,0')} Units`,
},{
  name: 'Max Productions',
  value: `${numeral(blueprint.max_production_limit).format('0,0')} Runs`,
}];

export default buildBlueprintInfo;
