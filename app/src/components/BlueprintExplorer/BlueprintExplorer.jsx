import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import {useQuery} from 'react-query';
import {connect} from 'react-redux';

import BlueprintExplorerFilters from './BlueprintExplorerFilters.jsx';
import StationTable from './StationTable.jsx';
import getBlueprintLocation from './../../api/getBlueprintLocation.js';
import Loading from './../Loading/Loading.jsx';

const queryWrapper = (Component) => (props) => {
  const queryFilter = {
    search: props.search,
    type: props.type,
    station_ids: props.selectedStation ? [props.selectedStation.station_id] : [],
  };
  const {data, status} = useQuery(['getBlueprintLocation', queryFilter], getBlueprintLocation);
  return <Component {...props} data={data} status={status} />;
};

const BlueprintExplorer = ({data, status}) => <Jumbotron>
  <h1>Blueprint Explorer</h1>
  <BlueprintExplorerFilters />
  <hr />
  {status === 'success' ? <StationTable locations={data.data.locations} /> : <Loading/>}
</Jumbotron>;

const mapStateToProps = ({globalState:{selectedStation}, blueprintExplorer:{search, type}}) => {
  return {selectedStation, search, type};
};

export default connect(mapStateToProps)(queryWrapper(BlueprintExplorer));
