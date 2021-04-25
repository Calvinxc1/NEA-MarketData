const fetchBlueprintLocation = async ({queryKey:[_key, {location_id, search, type}={}]}) => {
  let url = `http://${window.location.host}/api/location/blueprint`;
  if(location_id) {url = `${url}/${location_id}`}

  const params = [];
  if(search) {params.push(`search=${search}`)}
  if(type) {params.push(`type=${type}`)}

  if(params.length > 0) {url = `${url}?${params.toString().replace(',', '&')}`}
  const resp = await fetch(url);
  return resp.json();
}

export default fetchBlueprintLocation;
