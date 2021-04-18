import React from 'react';

const SankeyNode = ({name, x0, x1, y0, y1, color}) => {
  return <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={color}>
    <title>{name}</title>
  </rect>;
};

export default SankeyNode;
