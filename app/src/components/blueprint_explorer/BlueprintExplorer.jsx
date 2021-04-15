import React from 'react';
import {useQuery} from 'react-query';

import fetchBlueprintList from './../../fetchers/fetchBlueprintList.jsx';
import LocationsTable from './LocationsTable.jsx';

const BlueprintExplorer = () => {
  const {data, status} = useQuery('fetchBlueprintList', fetchBlueprintList)

  return <div>
    <h1>Blueprint Explorer</h1>
    {
      status === 'success'
      ? <LocationsTable data={data.data} />
      : <div>Loading...</div>
    }
  </div>;
}

export default BlueprintExplorer;
