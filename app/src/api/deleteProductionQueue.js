import axios from 'axios';

const deleteProductionQueue = async ({queue_id, queue_ids}) => {
  if(queue_id && queue_ids) throw new Error('Cannot accept both queue_id and queue_ids.');

  let path = `http://${window.location.host}/api/production/queue`;
  if(queue_id) path = `${path}/${queue_id}`;
  const params = {queue_ids: JSON.stringify(queue_ids)};

  const resp = await axios.delete(path, {params});
  return resp.data;
};

export default deleteProductionQueue;
