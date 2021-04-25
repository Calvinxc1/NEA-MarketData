const fetchBpItem = async ({queryKey:[_key, {type_id}]}) => {
  let url = `http://${window.location.host}/api/production/bpItem/${type_id}`;
  const resp = await fetch(url);
  return resp.json();
}

export default fetchBpItem;
