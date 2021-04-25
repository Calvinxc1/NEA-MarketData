const fetchBlueprintItem = async ({queryKey:[_key, {item_id}]}) => {
  const url = `http://${window.location.host}/api/blueprint/item/${item_id}`;
  const resp = await fetch(url);
  return resp.json();
}

export default fetchBlueprintItem;
