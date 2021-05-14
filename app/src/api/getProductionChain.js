import axios from 'axios';

const getProductionChain = async ({queryKey:[_key, {type_id, output_units=1, station_ids=[], ignore_activity=['reaction']}]}) => {
  const path = `http://${window.location.host}/api/production/chain/${type_id}`;
  const params = {
    output_units,
    station_ids: JSON.stringify(station_ids),
    ignore_activity: JSON.stringify(ignore_activity),
  };

  const resp = await axios.get(path, {params});
  return resp.data;
}

export default getProductionChain;
