import axios from 'axios';

const getBlueprintItem = async ({queryKey:[_key, {item_id}]}) => {
  const url = `http://${window.location.host}/api/blueprint/item/${item_id}`;
  const resp = await axios.get(url);
  return resp.data;
}

export default getBlueprintItem;
