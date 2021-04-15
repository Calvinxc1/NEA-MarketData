const fetchBlueprintList = async () => {
  const resp = await fetch(`http://${window.location.host}/api/blueprint`);
  return resp.json();
}

export default fetchBlueprintList;
