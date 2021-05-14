import axios from 'axios';

const putProductionQueue = async (queue_id, updateData) => {
  const path = `http://${window.location.host}/api/production/queue/${queue_id}`;
  const resp = await axios.put(path, updateData);
  return resp;
};

export default putProductionQueue;
