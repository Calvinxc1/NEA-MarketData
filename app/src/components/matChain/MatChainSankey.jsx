import React from 'react';
import {useQuery} from 'react-query';
import {useParams} from 'react-router-dom';

import fetchMatChainSankey from './../../fetchers/fetchMatChainSankey.jsx';
import SankeyRender from './SankeyRender.jsx';

const queryWrapper = (Component) => (props) => {
  const {type_id} = useParams();
  const {data, status} = useQuery(['fetchMatChainSankey', {type_id}], fetchMatChainSankey);

  if(status !== 'success') {
    return <div>Loading...</div>;
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
    return <svg width="100%" height="600" ref={this.svgRef} style={{background: '#FFFFFF'}}>
      <SankeyRender data={this.props.data} width={this.state.width} height={this.state.height} />
    </svg>;
  }
}

export default queryWrapper(MatChainSankey);
