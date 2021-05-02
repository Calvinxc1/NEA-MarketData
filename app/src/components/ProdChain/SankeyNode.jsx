import React from 'react';
import {connect} from 'react-redux';
import chroma from 'chroma-js';

import activityColor from './activityColor.js';
import storeMapper from './storeMapper.js';

class SankeyNode extends React.Component {
  state = {hover: false}

  constructor(props) {
    super(props);
    this.state.baseColor = chroma(activityColor(this.props.node.activity.type));
  }

  hoverOn = () => this.props.dispatch({
    type: 'ADD_HOVER',
    payload: {hoverType: 'node', hoverId: this.props.node.node_id},
  });

  hoverOff = () => this.props.dispatch({type: 'DROP_HOVER'});

  clickOn = () => this.props.dispatch({
    type: 'ADD_CLICK',
    payload: {clickType: 'node', clickId: this.props.node.node_id},
  });

  checkHover = () => {
    let hover = this.props.hoverType === 'node' && this.props.hoverId === this.props.node.node_id;
    this.props.node.sourceLinks.forEach((link) => {
      hover = hover || (this.props.hoverType === 'link' && this.props.hoverId === link.link_id);
      hover = hover || (this.props.hoverType === 'node' && this.props.hoverId === link.source.node_id);
      hover = hover || (this.props.hoverType === 'node' && this.props.hoverId === link.target.node_id);
    });
    this.props.node.targetLinks.forEach((link) => {
      hover = hover || (this.props.hoverType === 'link' && this.props.hoverId === link.link_id);
      hover = hover || (this.props.hoverType === 'node' && this.props.hoverId === link.source.node_id);
      hover = hover || (this.props.hoverType === 'node' && this.props.hoverId === link.target.node_id);
    });

    return hover;
  }

  checkClick = () => this.props.clickType === 'node' && this.props.clickId === this.props.node.node_id;

  render() {
    const width = this.props.node.x1 - this.props.node.x0;
    const height = this.props.node.y1 - this.props.node.y0;

    return <g transform={`translate(${this.props.node.x0},${this.props.node.y0})`}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={this.checkHover() ? this.state.baseColor.brighten(1).hex() : this.state.baseColor.hex()}
          style={{
            opacity: '0.5',
            stroke: this.checkClick() ? '#FFFFFF' : '#000000',
            strokeWidth: this.checkClick() ? 3 : 1,
          }}
          onMouseEnter={this.hoverOn}
          onMouseLeave={this.hoverOff}
          onClick={this.clickOn}
        />
        <defs>
          <filter x="-0.01" y="-0.05" width="1.02" height="1.1" id={`${this.props.node.node_id}-fill`}>
            <feFlood floodColor="#000000" result="bg" />
            <feMerge>
              <feMergeNode in="bg"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <text
          filter={`url(#${this.props.node.node_id}-fill)`}
          x={this.props.maxDepth === this.props.node.depth ? -5 : width+5}
          y={height/2}
          fill={this.checkHover() ? this.state.baseColor.brighten(1).hex() : this.state.baseColor.darken(1).hex()}
          textAnchor={this.props.maxDepth === this.props.node.depth ? 'end' : 'start'}
          dominantBaseline="central"
          onMouseEnter={this.hoverOn}
          onMouseLeave={this.hoverOff}
          onClick={this.clickOn}
        >{this.props.node.product.type.name}</text>
    </g>;
  }
}

export default connect(storeMapper)(SankeyNode);
