import React from 'react';
import Image from 'react-bootstrap/Image';
import BootstrapTable from 'react-bootstrap-table-next';
import {Link} from 'react-router-dom';

import buildBpUrl from './../../tools/buildBpUrl.jsx';

const columns = [{
  dataField: 'item_id',
  text: 'Open',
  formatter: (item_id, {type_id, bp_type}) => <Link to={`/blueprint/${item_id}`}>
    <Image src={`${buildBpUrl(type_id, bp_type)}?size=32`} thumbnail />
  </Link>,
  headerStyle: () => ({width: '64px', textAlign: 'center'}),
},{
  dataField: 'type_name',
  text: 'Blueprint Type',
  sort: true,
},{
  dataField: 'bp_type',
  text: 'Blueprint Type',
  formatter: (cell) => cell.charAt(0).toUpperCase() + cell.slice(1),
  headerStyle: () => ({width: '128px', textAlign: 'center'}),
},{
  dataField: 'quantity',
  text: 'Quantity',
  formatter: (cell, {runs, bp_type}) => <span>
    {bp_type === 'copy' ? `${runs} Run(s)` : `${cell} Unit(s)`}
  </span>,
  headerStyle: () => ({width: '128px', textAlign: 'center'}),
}];

const defaultSorted = [{dataField: 'type_name', order: 'asc'}];

const BlueprintsTable = (props) => <div>
  <BootstrapTable
    columns={columns}
    data={props.data}
    defaultSorted={defaultSorted}
    keyField="item_id"
    bootstrap4
    hover
  />
</div>;

export default BlueprintsTable;
