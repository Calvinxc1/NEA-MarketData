import React from 'react';
import sankeyLinkArea from './sankeyLinkArea.js'

const SankeyLink = ({link, color}) => {
  return <path
    d={sankeyLinkArea(link)}
    style={{
      fill: color,
      opacity: '0.3',
    }}
  />
};

export default SankeyLink;
