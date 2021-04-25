import React from 'react';
import {useQuery} from 'react-query';

import fetchBlueprintLocation from './../../fetchers/fetchBlueprintLocation.js';
import BlueprintLocationTable from './BlueprintLocationTable.jsx';
import Loading from './../Loading/Loading.jsx';

const BlueprintLocationTableExpanded = ({location:{location_id}, search, type}) => {
  const {data, status} = useQuery(['fetchBlueprintLocation', {location_id, search, type}], fetchBlueprintLocation);

  return <div>
    {status === 'success' ? <BlueprintLocationTable
      blueprints={data.data.blueprints}
      locations={data.data.locations}
    /> : <Loading />}
  </div>;
};

export default BlueprintLocationTableExpanded;
