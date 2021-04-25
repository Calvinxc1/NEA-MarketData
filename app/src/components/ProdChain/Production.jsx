import React from 'react';

import ProdChainSankey from './materials/prodChainSankey/ProdChainSankey.jsx';

const Production = ({match:{params:{type_id}}}) => <div>
  <ProdChainSankey type_id={type_id}/>
</div>

export default Production;
