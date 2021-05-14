import axios from 'axios';

const putProductionQueuePriority = async (priorities) => {
  const path = `http://${window.location.host}/api/production/queue/priority`;
  const resp = await axios.put(path, priorities);
  return resp;
};

export default putProductionQueuePriority;
