import React from 'react';
import {sankey, sankeyLeft, sankeyCenter} from 'd3-sankey';
import chroma from 'chroma-js';

import SankeyNode from './SankeyNode.jsx';
import SankeyLink from './SankeyLink.jsx';
import activityColor from './activityColor.js';

const SankeyRender = ({data, width, height}) => {
  const {nodes, links} = sankey()
    .nodeId((d) => d.id)
    .nodeWidth(15)
    .nodePadding(10)
    .nodeAlign(sankeyCenter)
    .extent([[1, 1], [width - 1, height - 5]])(data);

  const legendItems = ['purchasing', 'manufacturing', 'copying', 'invention'];

  return <g>
    {links.map((link, i) => (
      <SankeyLink
        link={link}
        key={link.index}
      />
    ))}
    {nodes.map((node, i) => (
      <SankeyNode
        node={node}
        key={node.id}
      />
    ))}
    <g
      transform={`translate(${width-20},${0})`}
    >
      {legendItems.map((legendItem, i) => <g key={legendItem}>
        <circle
          cx={0}
          cy={(i+1) * 20}
          r={6}
          fill={chroma(activityColor(legendItem)).darken(1).hex()}
        ></circle>
        <text
          x={-10}
          y={(i+1) * 20}
          textAnchor='end'
          alignmentBaseline='middle'
        >{legendItem}</text>
      </g>)}
    </g>
  </g>;
};

export default SankeyRender;
