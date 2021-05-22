import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

import buildBlueprintInfo from './buildBlueprintInfo.js';

const columns = [{
  dataField: 'name',
  text: 'Name',
  sort: true,
  headerAttrs: {hidden: true},
},{
  dataField: 'value',
  text: 'value',
  align: 'right',
  headerAttrs: {hidden: true},
}]

const BlueprintSummaryTable = ({blueprint}) => <BootstrapTable
  bootstrap4
  bordered={false}
  columns={columns}
  condensed
  data={buildBlueprintInfo(blueprint)}
  keyField='name'
/>;

export default BlueprintSummaryTable;
