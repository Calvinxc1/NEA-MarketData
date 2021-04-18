const fetchMatChainSankey = async ({queryKey:[_key, {type_id, output_target, bp_item_ids}]}) => {
  let url = `http://${window.location.host}/api/production/matChain/${type_id}/sankey?`;
  if(output_target) {url = `${url}output_target=${output_target}`}
  if(bp_item_ids) {url = `${url}bp_item_ids=${bp_item_ids.toString()}`}
  const resp = await fetch(url);
  return resp.json();
}

export default fetchMatChainSankey;
