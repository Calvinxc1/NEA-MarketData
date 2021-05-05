import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import {useQuery} from 'react-query';
import {connect} from 'react-redux';

import getProductionChain from './../../api/getProductionChain.js';
import SankeyRender from './SankeyRender.jsx';
import ProdChainHeader from './ProdChainHeader.jsx';
import Loading from './../Loading/Loading.jsx';
import ChainItemInfo from './ChainItemInfo.jsx';
import {reset} from './../../store/actions/prodChain.js';

const queryWrapper = (Component) => (props) => {
  const params = {
    type_id: props.match.params.type_id,
    output_units: props.units,
    station_ids: props.selectedStation ? [props.selectedStation.station_id] : [],
  };
  const {data, status} = useQuery(['getProductionChain', params], getProductionChain);
  return <Component {...props} data={data} status={status}/>;
};

class ProdChain extends React.Component {
  componentWillUnmount() {
    this.props.reset();
  }

  render() {
    const {data, status} = this.props;

    return <Jumbotron>
      <ProdChainHeader status={status} data={data} />
      {status === 'success' ? <SankeyRender data={data.data} /> : <Loading />}
      <ChainItemInfo />
    </Jumbotron>;
  }
}

const mapStateToProps = ({globalState:{selectedStation}, prodChain:{units}}) => {
  return {selectedStation, units};
};

export default connect(mapStateToProps, {reset})(queryWrapper(ProdChain));
