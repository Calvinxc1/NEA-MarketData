import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

import bpComponentTableCols from './bpComponentTableCols.js';

const BlueprintComponentList = ({components, by, materialEfficiency, activityType, runs}) => {
  const columns = bpComponentTableCols(by, materialEfficiency, activityType, runs);

  return <div>
    <BootstrapTable
      bootstrap4
      bordered={false}
      caption={<h5 style={{textAlign: 'center'}}>{
        by === 'material' ? 'Input Materials'
        : by === 'product' ? 'Output Product'
        : by === 'skill' ? 'Activity Skill Requirement'
        : null
      }</h5>}
      columns={columns}
      condensed
      data={components}
      hover
      keyField='type.id'
      noDataIndication='No Output Products'
    />
  </div>;
};

export default BlueprintComponentList;
