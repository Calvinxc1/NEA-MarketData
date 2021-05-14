import React from 'react';
import {useQuery} from 'react-query';
import {connect} from 'react-redux';

import getProductionQueue from './../../api/getProductionQueue.js';
import QueueList from './QueueList.jsx';
import Loading from './../Loading/Loading.jsx';
import DeleteModal from './DeleteModal.jsx';
import QuickbarModal from './QuickbarModal.jsx';
import deleteProductionQueue from './../../api/deleteProductionQueue.js';

const queryWrapper = (Component) => (props) => {
  let params = {}
  if(props.selectedStation) params.station_ids = [props.selectedStation.station_id];
  const {data, status, refetch} = useQuery(['getProductionQueue', params], getProductionQueue);
  return <Component {...props} data={data} status={status} refetch={refetch} />;
};

class ProductionQueue extends React.Component {
  deleteQueueRecord = (queue_id) => {
    const {data, refetch} = this.props;

    const deleteIdx = data.data.queues.findIndex((queue) => queue.id === queue_id);
    this.props.data.data.queues.splice(deleteIdx, 1);

    deleteProductionQueue(queue_id)
      .then((resp) => refetch())
      .catch((err) => console.log(err));
  };

  render() {
    const {status, data, refetch} = this.props;

    return <div>
      {console.log(data)}
      {status === 'success' ? <div>
        <QueueList queues={data.data.queues} refetch={refetch} />
        <DeleteModal deleteQueueRecord={this.deleteQueueRecord} />
        <QuickbarModal />
      </div> : <Loading />}
    </div>;
  }
}

const mapStateToProps = ({globalState:{selectedStation}}) => {
  return {selectedStation};
};

export default connect(mapStateToProps)(queryWrapper(ProductionQueue));
