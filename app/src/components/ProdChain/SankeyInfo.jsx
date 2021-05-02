import React from 'react';
import {connect} from 'react-redux';

import SankeyInfoNode from './SankeyInfoNode.jsx';
import SankeyInfoLink from './SankeyInfoLink.jsx';
import SankeyInfoNone from './SankeyInfoNone.jsx';
import storeMapper from './storeMapper.js';

const SankeyInfo = ({nodes, links, clickType, clickId, bp_items, updateBlueprintItems}) => <div>{
  clickType === 'node' ? <SankeyInfoNode
    node={nodes.find((node) => node.node_id === clickId)}
    bp_items={bp_items}
    updateBlueprintItems={updateBlueprintItems}
  />
  : clickType === 'link' ? <SankeyInfoLink
    link={links.find((link) => link.link_id === clickId)}
  />
  : <SankeyInfoNone />
}</div>;

export default connect(storeMapper)(SankeyInfo);
