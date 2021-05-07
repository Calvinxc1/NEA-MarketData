import axios from 'axios';

const getProductionChain = async ({queryKey:[_key, {type_id, output_units=1, station_ids=[], bp_items={}, ignore_activity=['reaction']}]}) => {
  const path = `http://${window.location.host}/api/production/chain/${type_id}`;
  const params = {output_units, station_ids, bp_items, ignore_activity};
  
  const resp = await axios.get(path, {params});
  return resp.data;
}

export default getProductionChain;
