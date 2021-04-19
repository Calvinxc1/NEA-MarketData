import React from 'react';
import {connect} from 'react-redux';
import chroma from 'chroma-js';

import sankeyLinkArea from './sankeyLinkArea.js'

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

  checkHover = () => {
    let hover = this.props.hoverType === 'link' && this.props.hoverId === this.props.link.index;
    hover = hover || (this.props.hoverType === 'node' && this.props.hoverId === this.props.link.source.id);
    hover = hover || (this.props.hoverType === 'node' && this.props.hoverId === this.props.link.target.id);

    return hover;
  }

  render() {
    return <path
      d={sankeyLinkArea(this.props.link)}
      fill={this.checkHover() ? this.state.baseColor.brighten(2).hex() : this.state.baseColor.hex()}
      style={{
        opacity: '0.5',
        stroke: '#000000',
        strokeOpacity: '1.0',
        strokeWidth: 1,
      }}
      onMouseEnter={() => this.hoverOn()}
      onMouseLeave={() => this.hoverOff()}
    />;
  }
}

const storeMapper = (state) => ({
  hoverType: state.hoverType,
  hoverId: state.hoverId,
});

export default connect(storeMapper)(SankeyLink);
