import React from 'react';
import {connect} from 'react-redux';
import chroma from 'chroma-js';

import sankeyLinkArea from './helpers/sankeyLinkArea.js'
import {addHover, dropHover, setActiveElement} from './../../store/actions/prodChain.js';

class SankeyLink extends React.Component {
  state = {
    baseColor: chroma('#777777'),
  };

  checkHover = () => {
    const {link, hoverType, hoverId} = this.props;

    let hover = hoverType === 'link' && hoverId === link.link_id;
    hover = hover || (hoverType === 'node' && hoverId === link.source.node_id);
    hover = hover || (hoverType === 'node' && hoverId === link.target.node_id);

    return hover;
  }

  checkClick = () => {
    const {link, activeElement} = this.props;
    const click = activeElement.link_id === link.link_id;
    return click;
  }

  render() {
    const {link, linkWeight, addHover, dropHover, setActiveElement} = this.props;
    const {baseColor} = this.state;

    return <path
      d={sankeyLinkArea(link, linkWeight.value)}
      fill={this.checkHover() ? baseColor.brighten(2).hex() : baseColor.hex()}
      style={{
        opacity: '0.5',
        stroke: this.checkClick() ? '#FFFFFF' : '#000000',
        strokeWidth: this.checkClick() ? 3 : 1,
      }}
      onMouseEnter={() => addHover('link', link.link_id)}
      onMouseLeave={() => dropHover()}
      onClick={() => setActiveElement(link)}
    />;
  }
}

const mapStateToProps = ({prodChain:{hoverType, hoverId, activeElement, linkWeight}}) => {
  return {hoverType, hoverId, activeElement, linkWeight};
};

export default connect(mapStateToProps, {addHover, dropHover, setActiveElement})(SankeyLink);
