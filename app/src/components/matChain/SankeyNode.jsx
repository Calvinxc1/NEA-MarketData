import React from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import {connect} from 'react-redux';
import chroma from 'chroma-js';

import activityColor from './activityColor.js';

class SankeyNode extends React.Component {
  state = {
    hover: false,
    target: React.createRef(),
  }

  constructor(props) {
    super(props);
    this.state.baseColor = chroma(activityColor(this.props.node.activity_type));
  }

  hoverOn = () => {
    this.props.dispatch({
      type: 'ADD_HOVER',
      payload: {hoverType: 'node', hoverId: this.props.node.id},
    });
  }

  hoverOff = () => {
    this.props.dispatch({type: 'DROP_HOVER'});
  }

  checkHover = () => {
    let hover = this.props.hoverType === 'node' && this.props.hoverId === this.props.node.id;
    this.props.node.sourceLinks.forEach((link) => {
      hover = hover || (this.props.hoverType === 'link' && this.props.hoverId === link.index);
      hover = hover || (this.props.hoverType === 'node' && this.props.hoverId === link.source.id);
      hover = hover || (this.props.hoverType === 'node' && this.props.hoverId === link.target.id);
    });
    this.props.node.targetLinks.forEach((link) => {
      hover = hover || (this.props.hoverType === 'link' && this.props.hoverId === link.index);
      hover = hover || (this.props.hoverType === 'node' && this.props.hoverId === link.source.id);
      hover = hover || (this.props.hoverType === 'node' && this.props.hoverId === link.target.id);
    });

    return hover;
  }

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
          stroke: '#000000',
          strokeWidth: 1,
        }}
        onMouseEnter={() => this.hoverOn()}
        onMouseLeave={() => this.hoverOff()}
        ref={this.state.target}
      ></rect>
      <Overlay
        target={this.state.target.current}
        show={true}
        placement='right'
      >
        <Tooltip
          onMouseEnter={() => this.hoverOn()}
          onMouseLeave={() => this.hoverOff()}
        ><div style={{
          color: this.checkHover() ? this.state.baseColor.brighten(1).hex() : this.state.baseColor.darken(1).hex(),
        }}>
          {this.props.node.prod_type_name}
        </div></Tooltip>
      </Overlay>
    </g>;
  }
}

const storeMapper = (state) => ({
  hoverType: state.hoverType,
  hoverId: state.hoverId,
});

export default connect(storeMapper)(SankeyNode);
