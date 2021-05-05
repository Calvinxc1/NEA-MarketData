import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import {useQuery} from 'react-query';
import {connect} from 'react-redux';

import fetchProductionChain from './../../fetchers/fetchProductionChain.js';
import SankeyRender from './SankeyRender.jsx';
import ProdChainHeader from './ProdChainHeader.jsx';
import Loading from './../Loading/Loading.jsx';
import ChainItemInfo from './ChainItemInfo.jsx';

const queryWrapper = (Component) => (props) => {
  const params = {
    type_id: props.match.params.type_id,
    output_units: props.runs,
    station_ids: props.selectedStation ? [props.selectedStation.station_id] : [],
  };
  const {data, status} = useQuery(['fetchProductionChain', params], fetchProductionChain);
  return <Component {...props} data={data} status={status}/>;
};

const ProdChain = ({data, status}) => <Jumbotron>
  <ProdChainHeader />
  {status === 'success' ? <SankeyRender data={data.data} /> : <Loading />}
  <ChainItemInfo />
</Jumbotron>;

const mapStateToProps = ({globalState:{selectedStation}, prodChain:{runs}}) => {
  return {selectedStation, runs};
};

export default connect(mapStateToProps)(queryWrapper(ProdChain));
