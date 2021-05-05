import axios from 'axios';

const getStations = async ({queryKey:[_key]}) => {
  const path = `http://${window.location.host}/api/station`;
  const resp = await axios.get(path);
  return resp.data;
};

export default getStations;
