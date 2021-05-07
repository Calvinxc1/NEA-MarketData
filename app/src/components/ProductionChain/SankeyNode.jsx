import React from 'react';
import {connect} from 'react-redux';
import chroma from 'chroma-js';

import activityColor from './helpers/activityColor.js';
import {setActiveElement, setHover} from './../../store/actions/prodChain.js';

class SankeyNode extends React.Component {
  state = {hover: false}

  constructor(props) {
    super(props);
    this.state.baseColor = chroma(activityColor(props.node.process[0].activity.type));
  }

  checkHover = () => {
    const {node, hover} = this.props;

    let hovered = hover.type === 'node' && hover.id === node.node_id;
    node.sourceLinks.forEach((link) => {
      hovered = hovered || (hover.type === 'link' && hover.id === link.link_id);
      hovered = hovered || (hover.type === 'node' && hover.id === link.source.node_id);
      hovered = hovered || (hover.type === 'node' && hover.id === link.target.node_id);
    });
    node.targetLinks.forEach((link) => {
      hovered = hovered || (hover.type === 'link' && hover.id === link.link_id);
      hovered = hovered || (hover.type === 'node' && hover.id === link.source.node_id);
      hovered = hovered || (hover.type === 'node' && hover.id === link.target.node_id);
    });

    return hovered;
  }

  checkClick = () => {
    const {node, activeElement} = this.props;
    const clicked = activeElement.node_id === node.node_id;
    return clicked;
  }

  render() {
    const width = this.props.node.x1 - this.props.node.x0;
    const height = this.props.node.y1 - this.props.node.y0;
    const {node, maxDepth, setHover, setActiveElement} = this.props;
    const {baseColor} = this.state;

    return <g transform={`translate(${node.x0},${node.y0})`}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={this.checkHover() ? baseColor.brighten(1).hex() : baseColor.hex()}
        style={{
          opacity: '0.5',
          stroke: this.checkClick() ? '#FFFFFF' : '#000000',
          strokeWidth: this.checkClick() ? 3 : 1,
        }}
        onMouseEnter={() => setHover('node', node.node_id)}
        onMouseLeave={() => setHover()}
        onClick={() => setActiveElement(node)}
      />
      <defs>
        <filter x="-0.01" y="-0.05" width="1.02" height="1.1" id={`${node.node_id}-fill`}>
          <feFlood floodColor="#000000" result="bg" />
          <feMerge>
            <feMergeNode in="bg"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <text
        filter={`url(#${node.node_id}-fill)`}
        x={maxDepth === node.depth ? -5 : width+5}
        y={height/2}
        fill={this.checkHover() ? baseColor.brighten(1).hex() : baseColor.darken(1).hex()}
        textAnchor={maxDepth === node.depth ? 'end' : 'start'}
        dominantBaseline="central"
        onMouseEnter={() => setHover('node', node.node_id)}
        onMouseLeave={() => setHover()}
        onClick={() => setActiveElement(node)}
      >{node.type.name}</text>
    </g>;
  }
}

const mapStateToProps = ({prodChain:{hover, activeElement}}) => {
  return {hover, activeElement};
};

export default connect(mapStateToProps, {setHover, setActiveElement})(SankeyNode);
