import React from 'react';
import {useQuery} from 'react-query';

import getBlueprintItem from './../../api/getBlueprintItem.js';
import BlueprintHeader from './BlueprintHeader.jsx';
import BlueprintActivities from './BlueprintActivities.jsx';
import Loading from './../Loading/Loading.jsx';

const queryWrapper = (Component) => (props) => {
  const queryFilter = {item_id: props.match.params.item_id};
  const {data, status} = useQuery(['getBlueprintItem', queryFilter], getBlueprintItem);
  return <Component {...props} data={data} status={status} />;
};

const BlueprintItem = ({data, status}) => status === 'success' ? <div>
  {console.log(data)}
  <BlueprintHeader blueprint={data.data} />
  <hr />
  <BlueprintActivities
    activities={data.data.activities}
    material_efficiency={data.data.material_efficiency}
    time_efficiency={data.data.time_efficiency}
    bp_type={data.data.bp_type}
    max_production_limit={data.data.max_production_limit}
  />
</div>
: <Loading />;

export default queryWrapper(BlueprintItem);
