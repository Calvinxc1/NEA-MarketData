import React from 'react';
import {useQuery} from 'react-query';

import getBlueprintLocation from './../../api/getBlueprintLocation.js';
import BlueprintLocationTable from './BlueprintLocationTable.jsx';
import Loading from './../Loading/Loading.jsx';

const BlueprintLocationTableExpanded = ({location:{location_id}, search, type}) => {
  const {data, status} = useQuery(['getBlueprintLocation', {location_id, search, type}], getBlueprintLocation);

  return <div>
    {status === 'success' ? <BlueprintLocationTable
      blueprints={data.data.blueprints}
      locations={data.data.locations}
    /> : <Loading />}
  </div>;
};

export default BlueprintLocationTableExpanded;
