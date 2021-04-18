import React from 'react';
import {useQuery} from 'react-query';
import {useParams} from 'react-router-dom';

import fetchBlueprint from './../../fetchers/fetchBlueprint.jsx';
import BlueprintInfo from './BlueprintInfo.jsx';

const Blueprint = () => {
  const {item_id} = useParams();
  const {data, status} = useQuery(['fetchBlueprint', {item_id}], fetchBlueprint);

  if(status !== 'success') {
    return <div>Loading...</div>;
  } else {
    return <div>
      <BlueprintInfo blueprint={data.data} />
    </div>;
  }
}

export default Blueprint;
