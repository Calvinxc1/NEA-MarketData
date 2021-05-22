import React from 'react';
import {useQuery} from 'react-query';
import {connect} from 'react-redux';

import getBlueprintLocation from './../../api/getBlueprintLocation.js';
import LocationItems from './LocationItems.jsx';
import Loading from './../Loading/Loading.jsx';

const queryWrapper = (Component) => (props) => {
  const queryFilter = {
    location_id: props.location.location_id,
    search: props.search,
    type: props.type,
    station_ids: [props.station_id],
  };
  const {data, status} = useQuery(['getBlueprintLocation', queryFilter], getBlueprintLocation);
  return <Component {...props} data={data} status={status} />;
};

const LocationTableExpand = ({data, status, station_id}) => <div>
  {status === 'success' ? <LocationItems
    blueprints={data.data.blueprints}
    locations={data.data.locations}
    station_id={station_id}
  /> : <Loading />}
</div>;

const mapStateToProps = ({blueprintExplorer:{search, type}}) => {
  return {search, type};
};

export default connect(mapStateToProps)(queryWrapper(LocationTableExpand));
