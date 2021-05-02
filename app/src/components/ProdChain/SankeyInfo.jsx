import React from 'react';
import {connect} from 'react-redux';

import SankeyInfoNode from './SankeyInfoNode.jsx';
import SankeyInfoLink from './SankeyInfoLink.jsx';
import SankeyInfoNone from './SankeyInfoNone.jsx';
import storeMapper from './storeMapper.js';

const SankeyInfo = ({nodes, links, clickType, clickId, bp_items, updateBlueprintItems}) => {
  let element = null;
  if(clickType === 'node') {
    element = nodes.find((node) => node.node_id === clickId);
  } else if(clickType === 'link') {
    element = links.find((link) => link.link_id === clickId);
  }

  return <div>{
    clickType === 'node'&& element ? <SankeyInfoNode
      node={element}
      bp_items={bp_items}
      updateBlueprintItems={updateBlueprintItems}
    />
    : clickType === 'link' && element ? <SankeyInfoLink link={element} />
    : <SankeyInfoNone />
  }</div>;
}

export default connect(storeMapper)(SankeyInfo);
