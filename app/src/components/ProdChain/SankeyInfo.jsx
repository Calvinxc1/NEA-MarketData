import React from 'react';
import {connect} from 'react-redux';

import SankeyInfoNode from './SankeyInfoNode.jsx';
import SankeyInfoLink from './SankeyInfoLink.jsx';
import SankeyInfoNone from './SankeyInfoNone.jsx';
import storeMapper from './storeMapper.js';

const SankeyInfo = ({nodes, links, clickType, clickId, bp_item_ids, addBpItemId, removeBpItemId}) => <div>{
  clickType === 'node' ? <SankeyInfoNode
    node={nodes.find((node) => node.node_id === clickId)}
    bp_item_ids={bp_item_ids}
    addBpItemId={addBpItemId}
    removeBpItemId={removeBpItemId}
  />
  : clickType === 'link' ? <SankeyInfoLink
    link={links.find((link) => link.link_id === clickId)}
  />
  : <SankeyInfoNone />
}</div>;

export default connect(storeMapper)(SankeyInfo);
