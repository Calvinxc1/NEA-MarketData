import axios from 'axios';

const fetchProductionChain = async ({queryKey:[_key, {type_id, output_units=1, station_ids=[], ignore_activity=['reaction']}]}) => {
  const path = `http://${window.location.host}/api/production/chain/${type_id}`;
  const resp = await axios.get(path, {params:{
    output_units,
    station_ids: station_ids.toString(),
    ignore_activity: ignore_activity.toString(),
  }});
  return resp.data;
}

export default fetchProductionChain;
