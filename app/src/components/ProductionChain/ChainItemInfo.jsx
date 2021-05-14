import React from 'react';
import {connect} from 'react-redux';

import ChainNodeInfo from './ChainNodeInfo.jsx';
import ChainLinkInfo from './ChainLinkInfo.jsx';

const ChainItemInfo = ({activeElement}) => <div>
  {activeElement.node_id && <ChainNodeInfo node={activeElement} />}
  {activeElement.link_id && <ChainLinkInfo link={activeElement} />}
</div>;

const mapStateToProps = ({productionChain:{activeElement}}) => ({activeElement});

export default connect(mapStateToProps)(ChainItemInfo);
