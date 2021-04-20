import React from 'react';
import chroma from 'chroma-js';

import activityColor from './../activityColor.js';

const SankeyLegend = ({width}) => {
  const legendItems = ['purchasing', 'manufacturing', 'copying', 'invention'];
  const boxWidth = 135;
  const itemHeight = 18;
  const margin = 4;
  const rounding = 10;
  const dotRad = 6;

  return <g transform={`translate(${width},${0})`}>
    <rect
      x={-boxWidth}
      y={-rounding}
      rx={rounding}
      ry={rounding}
      height={(legendItems.length * itemHeight) + (itemHeight/2) + (margin*2) + rounding}
      width={boxWidth + rounding}
      fill={'#444444'}
      style={{
        stroke: '#000000',
        strokeWidth: '1.5px'
      }}
    ></rect>
    {legendItems.map((legendItem, i) => <g key={legendItem}>
      <circle
        cx={-(dotRad*2) - margin}
        cy={(i+1) * itemHeight}
        r={dotRad}
        fill={chroma(activityColor(legendItem)).darken(1).hex()}
        style={{
          stroke: '#000000',
          strokeWidth: '0.5px',
        }}
      ></circle>
      <text
        x={-(dotRad*4) - margin}
        y={(i+1) * itemHeight}
        textAnchor='end'
        alignmentBaseline='middle'
        fill={chroma(activityColor(legendItem)).darken(0.5).hex()}
      >{legendItem.split('_').map((word) => word[0].toUpperCase() + word.substr(1)).join(' ')}</text>
    </g>)}
  </g>;
};

export default SankeyLegend;
