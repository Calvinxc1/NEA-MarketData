const fetchProdChainSankey = async ({queryKey:[_key, {type_id, output_target, station_id=[], bp_item_ids=[]}]}) => {
  const path = `http://${window.location.host}/api/production/${type_id}/chain`;
  const params = [];
  if(output_target) {params.push(`output_target=${output_target}`)}
  if(station_id.length > 0) {params.push(`station_id=${station_id.toString()}`)}
  if(bp_item_ids.length > 0) {params.push(`bp_item_ids=${bp_item_ids.toString()}`)}
  const url = `${path}?${params.toString().replace(',', '&')}`
  const resp = await fetch(url);
  return resp.json();
}

export default fetchProdChainSankey;
