import React from 'react';
import {useQuery} from 'react-query';
import {connect} from 'react-redux';

import getProductionQueue from './../../api/getProductionQueue.js';
import QueueList from './QueueList.jsx';
import QueueNeeds from './QueueNeeds.jsx';
import Loading from './../Loading/Loading.jsx';

const queryWrapper = (Component) => (props) => {
  let params = {}
  if(props.selectedStation) params.station_ids = [props.selectedStation.station_id];
  const {data, status, refetch} = useQuery(['getProductionQueue', params], getProductionQueue);
  return <Component {...props} data={data} status={status} refetch={refetch} />;
};

const ProductionQueue = ({status, data, refetch}) => <div>
  {status === 'success' ? <div>
    <QueueList
      queue={data.data.queue}
      refetch={refetch}
    />
    <QueueNeeds needs={data.data.needs} />
  </div> : <Loading />}
</div>;

const mapStateToProps = ({globalState:{selectedStation}}) => {
  return {selectedStation};
};

export default connect(mapStateToProps)(queryWrapper(ProductionQueue));
