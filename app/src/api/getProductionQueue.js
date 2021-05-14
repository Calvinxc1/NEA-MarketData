import axios from 'axios';

const getProductionQueue = async ({queryKey:[_key, {queue_id, station_ids=[]}={}]}) => {
  let path = `http://${window.location.host}/api/production/queue`;
  if(queue_id) {path = `${path}/${queue_id}`}
  const params = {station_ids: JSON.stringify(station_ids)};
  const resp = await axios.get(path, {params});
  return resp.data;
};

export default getProductionQueue;
