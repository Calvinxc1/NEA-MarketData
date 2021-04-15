const fetchBlueprintProduct = async ({queryKey:[_key, {type_id, station_id}]}) => {
  let url = `http://${window.location.host}/api/blueprint/product/${type_id}`;
  if(station_id) {
    url = `${url}?parent_station_id=${station_id}`;
  }
  const resp = await fetch(url);
  return resp.json();
}

export default fetchBlueprintProduct;
