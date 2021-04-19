import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import {useQuery} from 'react-query';
import {Provider} from 'react-redux';
import {useParams} from 'react-router-dom';

import fetchMatChainSankey from './../../fetchers/fetchMatChainSankey.jsx';
import SankeyRender from './SankeyRender.jsx';
import Loading from './../loading/Loading.jsx';
import store from './store.js';

const queryWrapper = (Component) => (props) => {
  const {type_id} = useParams();
  const {data, status} = useQuery(['fetchMatChainSankey', {type_id}], fetchMatChainSankey);

  if(status !== 'success') {
    return <Loading />;
  }
  else {
    return <MatChainSankey {...props} data={data.data} />;
  }
}

class MatChainSankey extends React.Component {
  state = {width: 512, height: 512};
  svgRef = React.createRef();

  componentDidMount() {
    this.measureSVG();
    window.addEventListener("resize", this.measureSVG);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.measureSVG);
  }

  measureSVG = () => {
    const {width, height} = this.svgRef.current.getBoundingClientRect()
    this.setState({width, height});
  };

  render() {
    return <Jumbotron><Provider store={store}>
      <svg width="100%" height="900" ref={this.svgRef}>
        <SankeyRender data={this.props.data} width={this.state.width} height={this.state.height} />
      </svg>
    </Provider></Jumbotron>;
  }
}

export default queryWrapper(MatChainSankey);
