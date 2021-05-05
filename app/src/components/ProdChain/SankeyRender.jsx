import React from 'react';
import {sankey, sankeyCenter} from 'd3-sankey';

import SankeyNode from './SankeyNode.jsx';
import SankeyLink from './SankeyLink.jsx';

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
        return a.type.group.category.name.localeCompare(b.type.group.category.name)
          || a.type.group.name.localeCompare(b.type.group.name)
          || a.type.name.localeCompare(b.type.name);
      })
      .extent([[1, 1], [width - 1, height - 1]]);

    this.setState({width, height});
  };

  render() {
    const {data} = this.props;
    const {height, width} = this.state;

    data.nodes.forEach((o) => o.fixedValue = 1);
    data.links.map((o) => o.value = 1);

    const {nodes, links} = this.sankey ? this.sankey(this.props.data) : {};
    const maxDepth = nodes ? nodes.reduce((acc, node) => node.depth > acc ? node.depth : acc, 0) : 0;

    console.log(nodes, links);

    return <div>
      <svg width="100%" height="900" ref={this.svgRef}><g>
        <rect
          x={0} y={0}
          height={height} width={width}
          fill='none'
          style={{stroke: '#000000', strokeWidth: '3px'}}
        ></rect>
        {links && links.map((link) => <SankeyLink link={link} key={link.link_id} />)}
        {nodes && nodes.map((node) => <SankeyNode node={node} key={node.node_id} maxDepth={maxDepth} />)}
      </g></svg>
    </div>;
  }
}

export default SankeyRender;
