import React from 'react';
import {connect} from 'react-redux';
import chroma from 'chroma-js';

import sankeyLinkArea from './sankeyLinkArea.js'
import storeMapper from './storeMapper.js';

class SankeyLink extends React.Component {
  state = {
    baseColor: chroma('#777777'),
  };

  hoverOn = () => {
    this.props.dispatch({
      type: 'ADD_HOVER',
      payload: {hoverType: 'link', hoverId: this.props.link.link_id},
    });
  }

  hoverOff = () => {
    this.props.dispatch({type: 'DROP_HOVER'});
  }

  clickOn = () => this.props.dispatch({
    type: 'ADD_CLICK',
    payload: {clickType: 'link', clickId: this.props.link.link_id},
  });

  checkHover = () => {
    let hover = this.props.hoverType === 'link' && this.props.hoverId === this.props.link.link_id;
    hover = hover || (this.props.hoverType === 'node' && this.props.hoverId === this.props.link.source.node_id);
    hover = hover || (this.props.hoverType === 'node' && this.props.hoverId === this.props.link.target.node_id);
    return hover;
  }

  checkClick = () => this.props.clickType === 'link' && this.props.clickId === this.props.link.link_id;

  render() {
    return <path
      d={sankeyLinkArea(this.props.link, this.props.scalePath)}
      fill={this.checkHover() ? this.state.baseColor.brighten(2).hex() : this.state.baseColor.hex()}
      style={{
        opacity: '0.5',
        stroke: this.checkClick() ? '#FFFFFF' : '#000000',
        strokeWidth: this.checkClick() ? 3 : 1,
      }}
      onMouseEnter={this.hoverOn}
      onMouseLeave={this.hoverOff}
      onClick={this.clickOn}
    />;
  }
}

export default connect(storeMapper)(SankeyLink);
