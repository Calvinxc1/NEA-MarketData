import React from 'react';
import * as d3 from 'd3';
import {sankey} from 'd3-sankey';
import chroma from "chroma-js";

import SankeyNode from './SankeyNode.jsx';
import SankeyLink from './SankeyLink.jsx';

const SankeyRender = ({data, width, height}) => {
  const {nodes, links} = sankey()
    .nodeId((d) => d.id)
    .nodeWidth(15)
    .nodePadding(10)
    .extent([[1, 1], [width - 1, height - 5]])(data);

  const color = chroma.scale("Set3")
    .classes(nodes.length);

  const colorScale = d3.scaleLinear()
    .domain([0, nodes.length])
    .range([0, 1]);

  return <g style={{ mixBlendMode: "multiply" }}>
    {nodes.map((node, i) => (
      <SankeyNode
        {...node}
        color={color(colorScale(i)).hex()}
        key={node.id}
      />
    ))}
    {links.map((link, i) => (
      <SankeyLink
        link={link}
        color={color(colorScale(link.source.index)).hex()}
        key={link.index}
      />
    ))}
  </g>;
};

export default SankeyRender;
