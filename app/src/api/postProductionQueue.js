import axios from 'axios';

const postProductionQueue = async (queue) => {
  const path = `http://${window.location.host}/api/production/queue`;
  const resp = await axios.post(path, queue);
  return resp.data;
};

export default postProductionQueue;
