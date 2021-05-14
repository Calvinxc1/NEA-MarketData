import axios from 'axios';

const deleteProductionQueue = async (queue_id) => {
  let path = `http://${window.location.host}/api/production/queue/${queue_id}`;
  const resp = await axios.delete(path);
  return resp;
};

export default deleteProductionQueue;
