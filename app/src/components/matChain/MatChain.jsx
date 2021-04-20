import React from 'react';

import MatChainSankey from './sankey/MatChainSankey.jsx';

const MatChain = ({match:{params:{type_id}}}) => <div>
  <MatChainSankey type_id={type_id}/>
</div>

export default MatChain;
