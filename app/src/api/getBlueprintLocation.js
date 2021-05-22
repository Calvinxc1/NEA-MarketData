import axios from 'axios';

const getBlueprintLocation = async ({queryKey:[_key, {location_id, search, type, station_ids}={}]}) => {
  let path = `http://${window.location.host}/api/blueprint/location`;
  if(location_id) {path = `${path}/${location_id}`}
  let params = {};
  if(search) params.search = search;
  if(type) params.type = type;
  if(station_ids) params.station_ids = JSON.stringify(station_ids);
  const resp = await axios.get(path, {params});
  return resp.data;
}

export default getBlueprintLocation;
