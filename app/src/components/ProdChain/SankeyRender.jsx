import React from 'react';
import {useQuery} from 'react-query';
import {sankey, sankeyCenter} from 'd3-sankey';

import fetchProdChainSankey from './../../fetchers/fetchProdChainSankey.jsx';
import SankeyNode from './SankeyNode.jsx';
import SankeyLink from './SankeyLink.jsx';
import SankeyLegend from './SankeyLegend.jsx';
import SankeyInfo from './SankeyInfo.jsx';
import Loading from './../Loading/Loading.jsx';

const queryWrapper = (Component) => (props) => {
  const {type_id, output_target, bp_item_ids} = props;
  const {data, status} = useQuery(['fetchProdChainSankey', {type_id, output_target, bp_item_ids}], fetchProdChainSankey);
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
      .nodeId((d) => d.node_id)
      .nodeWidth(15)
      .nodePadding(10)
      .nodeAlign(sankeyCenter)
      .nodeSort((a,b) => {
        return a.product.group.category.name.localeCompare(b.product.group.category.name)
          || a.product.group.name.localeCompare(b.product.group.name)
          || a.product.type_name.localeCompare(b.product.type_name);
      })
      .extent([[1, 1], [width - 1, height - 1]]);

    this.setState({width, height});
  };

  render() {
    this.props.data.nodes.map((o) => {
      o.fixedValue = 1;
      return null;
    });
    this.props.data.links.map((o) => {
      o.value = 1;
      return null;
    });
    const {nodes, links} = this.sankey ? this.sankey(this.props.data) : {};

    console.log(nodes, links);

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
              key={link.link_id}
              scalePath={this.props.scalePath}
            />
          ))}
          {nodes && nodes.map((node) => (
            <SankeyNode
              node={node}
              key={node.node_id}
            />
          ))}
        </g>
      </svg>
      <hr />
      {nodes && links && <SankeyInfo
        nodes={nodes}
        links={links}
        bp_item_ids={this.props.bp_item_ids}
        addBpItemId={this.props.addBpItemId}
        removeBpItemId={this.props.removeBpItemId}
      />}
    </div>;
  }
}

export default queryWrapper(SankeyRender);
