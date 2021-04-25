import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import {connect} from 'react-redux';
import chroma from 'chroma-js';

import activityColor from './activityColor.js';
import storeMapper from './storeMapper.js';

class SankeyNode extends React.Component {
  state = {
    hover: false,
    //target: React.createRef(),
  }

  constructor(props) {
    super(props);
    this.state.baseColor = chroma(activityColor(this.props.node.activity_type));
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

  renderTooltip = (props) => <Tooltip
    {...props}
    id={this.props.node.bp_type_id}
    onMouseEnter={this.hoverOn}
    onMouseLeave={this.hoverOff}
    onClick={this.clickOn}
  >
    <div style={{
      color: this.checkHover() ? this.state.baseColor.brighten(1).hex() : this.state.baseColor.darken(1).hex(),
    }}>
      {this.props.node.product.type_name}
    </div>
  </Tooltip>;

  render() {
    const width = this.props.node.x1 - this.props.node.x0;
    const height = this.props.node.y1 - this.props.node.y0;

    return <g transform={`translate(${this.props.node.x0},${this.props.node.y0})`}>
      <OverlayTrigger
        overlay={this.renderTooltip}
        placement='right'
        show={this.props.showLabels}
      >
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
        ></rect>
      </OverlayTrigger>
    </g>;
  }
}

export default connect(storeMapper)(SankeyNode);
