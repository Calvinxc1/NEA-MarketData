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
      payload: {hoverType: 'link', hoverId: this.props.link.index},
    });
  }

  hoverOff = () => {
    this.props.dispatch({type: 'DROP_HOVER'});
  }

  clickOn = () => this.props.dispatch({
    type: 'ADD_CLICK',
    payload: {clickType: 'link', clickId: this.props.link.index},
  });

  checkHover = () => {
    let hover = this.props.hoverType === 'link' && this.props.hoverId === this.props.link.index;
    hover = hover || (this.props.hoverType === 'node' && this.props.hoverId === this.props.link.source.id);
    hover = hover || (this.props.hoverType === 'node' && this.props.hoverId === this.props.link.target.id);

    return hover;
  }

  checkClick = () => this.props.clickType === 'link' && this.props.clickId === this.props.link.index;

  render() {
    return <path
      d={sankeyLinkArea(this.props.link)}
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
