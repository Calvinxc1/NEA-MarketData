import React from 'react';
import {useQuery} from 'react-query';
import {sankey, sankeyCenter} from 'd3-sankey';

import fetchMatChainSankey from './../../../fetchers/fetchMatChainSankey.jsx';
import SankeyNode from './SankeyNode.jsx';
import SankeyLink from './SankeyLink.jsx';
import SankeyLegend from './SankeyLegend.jsx';
import SankeyInfo from './SankeyInfo.jsx';
import Loading from './../../loading/Loading.jsx';

const queryWrapper = (Component) => (props) => {
  const {type_id, output_target} = props;
  const {data, status} = useQuery(['fetchMatChainSankey', {type_id, output_target}], fetchMatChainSankey);

  return status === 'success' ? <Component {...props} data={data.data} /> : <Loading />;
};

class SankeyRender extends React.Component {
  state = {width: null, height: null};
  svgRef = React.createRef();

  componentDidMount() {
    this.measureSVG();
    window.addEventListener("resize", this.measureSVG);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.measureSVG);
  }

  measureSVG = () => {
    const {width, height} = this.svgRef.current.getBoundingClientRect();
    this.sankey = sankey()
      .nodeId((d) => d.id)
      .nodeWidth(15)
      .nodePadding(10)
      .nodeAlign(sankeyCenter)
      .extent([[1, 1], [width - 1, height - 1]]);

    this.setState({width, height});
  };

  render() {
    const {nodes, links} = this.sankey ? this.sankey(this.props.data) : {};

    return <div>
      <svg width="100%" height="900" ref={this.svgRef}>
        <g>
          {this.state.width && <SankeyLegend width={this.state.width} />}
          <rect
            x={0}
            y={0}
            height={this.state.height}
            width={this.state.width}
            fill={'none'}
            style={{
              stroke: '#000000',
              strokeWidth: '3px',
            }}
          ></rect>
          {links && links.map((link) => (
            <SankeyLink
              link={link}
              key={link.index}
            />
          ))}
          {nodes && nodes.map((node) => (
            <SankeyNode
              node={node}
              key={node.id}
            />
          ))}
        </g>
      </svg>
      <hr />
      {nodes && links && <SankeyInfo
        nodes={nodes}
        links={links}
      />}
    </div>;
  }
}

export default queryWrapper(SankeyRender);
