import React from 'react';
import {useQuery} from 'react-query';

import fetchBlueprintItem from './../../fetchers/fetchBlueprintItem.js';
import BlueprintDetailsHeader from './BlueprintDetailsHeader.jsx';
import BlueprintActivities from './BlueprintActivities.jsx';
import Loading from './../Loading/Loading.jsx';

const allowedActivities = {
  original: ['copying', 'manufacturing', 'research_material', 'research_time'],
  copy: ['invention', 'manufacturing'],
  relic: ['invention'],
};

const BlueprintDetails = ({item_id, runs, updateRuns}) => {
  const {data, status} = useQuery(['fetchBlueprintItem', {item_id}], fetchBlueprintItem);

  let activities = [];
  if(status === 'success') {
    activities = data.data.activities.filter((activity) => {
      return allowedActivities[data.data.bp_type].includes(activity.activity_type);
    });
  }

  return <div>
    {status === 'success' ? <div>
      <BlueprintDetailsHeader blueprint={data.data}/>
      <hr />
      <BlueprintActivities
        activities={activities}
        material_efficiency={data.data.material_efficiency}
        time_efficiency={data.data.time_efficiency}
        bp_type={data.data.bp_type}
        max_production_limit={data.data.max_production_limit}
        runs={runs}
        updateRuns={updateRuns}
      />
    </div> : <Loading />}
  </div>;
}

export default BlueprintDetails;
