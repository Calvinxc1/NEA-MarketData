import React from 'react';
import {useQuery} from 'react-query';
import {sankey, sankeyCenter} from 'd3-sankey';

import fetchProductionChain from './../../fetchers/fetchProductionChain.js';
import SankeyNode from './SankeyNode.jsx';
import SankeyLink from './SankeyLink.jsx';
import SankeyInfo from './SankeyInfo.jsx';
import Loading from './../Loading/Loading.jsx';

const queryWrapper = (Component) => (props) => {
  const {type_id, output_units, station_ids, bp_items} = props;
  const {data, status} = useQuery(['fetchProductionChain', {type_id, output_units, station_ids, bp_items}], fetchProductionChain);
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
      .nodeSort((a, b) => {
        return a.product.type.group.category.name.localeCompare(b.product.type.group.category.name)
          || a.product.type.group.name.localeCompare(b.product.type.group.name)
          || a.product.type.name.localeCompare(b.product.type.name);
      })
      .extent([[1, 1], [width - 1, height - 1]]);

    this.setState({width, height});
  };

  buildBaseBpItems = (nodes) => {
    let bp_items = {}
    nodes.filter((node) => node.type.id !== -1).forEach((node) => {
      bp_items[node.product.type.id] = node.items.selected.item_id
    });
    return bp_items;
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
    let maxDepth;
    if(nodes) {
      maxDepth = nodes.reduce((acc, node) => node.depth > acc ? node.depth : acc, 0);
    } else {
      maxDepth = 0;
    }

    console.log(this.props.data);

    return <div>
      <svg width="100%" height="900" ref={this.svgRef}>
        <g>
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
              maxDepth={maxDepth}
            />
          ))}
        </g>
      </svg>
      <hr />
      {nodes && links && <SankeyInfo
        nodes={nodes}
        links={links}
        bp_items={this.props.bp_items ? this.props.bp_items : this.buildBaseBpItems(this.props.data.nodes)}
        updateBlueprintItems={this.props.updateBlueprintItems}
      />}
    </div>;
  }
}

export default queryWrapper(SankeyRender);
