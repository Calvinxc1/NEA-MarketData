import React from 'react';
import {connect} from 'react-redux';
import chroma from 'chroma-js';

import sankeyLinkArea from './helpers/sankeyLinkArea.js'
import {setActiveElement, setHover} from './../../store/actions/prodChain.js';

class SankeyLink extends React.Component {
  state = {
    baseColor: chroma('#777777'),
  };

  checkHover = () => {
    const {link, hover} = this.props;

    let hovered = hover.type === 'link' && hover.id === link.link_id;
    hovered = hovered || (hover.type === 'node' && hover.id === link.source.node_id);
    hovered = hovered || (hover.type === 'node' && hover.id === link.target.node_id);

    return hovered;
  }

  checkClick = () => {
    const {link, activeElement} = this.props;
    const clicked = activeElement.link_id === link.link_id;
    return clicked;
  }

  render() {
    const {link, linkWeight, setHover, setActiveElement} = this.props;
    const {baseColor} = this.state;

    return <path
      d={sankeyLinkArea(link, linkWeight.value)}
      fill={this.checkHover() ? baseColor.brighten(2).hex() : baseColor.hex()}
      style={{
        opacity: '0.5',
        stroke: this.checkClick() ? '#FFFFFF' : '#000000',
        strokeWidth: this.checkClick() ? 3 : 1,
      }}
      onMouseEnter={() => setHover('link', link.link_id)}
      onMouseLeave={() => setHover()}
      onClick={() => setActiveElement(link)}
    />;
  }
}

const mapStateToProps = ({prodChain:{activeElement, hover, linkWeight}}) => {
  return {hover, activeElement, linkWeight};
};

export default connect(mapStateToProps, {setActiveElement, setHover})(SankeyLink);
