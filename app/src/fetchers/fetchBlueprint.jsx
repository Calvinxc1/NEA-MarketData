const fetchBlueprint = async ({queryKey:[_key, {item_id}]}) => {
  const resp = await fetch(`http://${window.location.host}/api/blueprint/${item_id}`);
  return resp.json();
}

export default fetchBlueprint;
