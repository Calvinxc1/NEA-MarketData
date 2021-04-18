import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

import componentCols from './componentCols.jsx';

const BlueprintInfoComponents = ({components, by, runs, materialEfficiency, activityType, stationFilter}) => {
  const columns = componentCols(by, runs, materialEfficiency, activityType, stationFilter);
  return <div>
    <BootstrapTable
      bootstrap4
      bordered={false}
      caption={<h5 style={{textAlign: 'center'}}>{
        by === 'product' ? 'Materials'
        : by === 'material' ? 'Products'
        : null
      }</h5>}
      columns={columns}
      condensed
      data={components}
      hover
      keyField='type_id'
      noDataIndication='No Output Products'
    />
  </div>
};

export default BlueprintInfoComponents;
