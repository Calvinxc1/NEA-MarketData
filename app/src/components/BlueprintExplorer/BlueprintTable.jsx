import React from 'react';
import Image from 'react-bootstrap/Image';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {Link} from 'react-router-dom';

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';

const columns = [{
  dataField: 'type',
  text: '',
  formatter: (type, {bp_type, item_id}) => <Link to={`/blueprint/item/${item_id}`}>
    <Image
      src={parseTypeImageUrl(type, 32,
        bp_type === 'copy' ? 'bpc'
        : bp_type === 'relic' ? 'relic'
        : 'bp'
      )}
      thumbnail
    />
  </Link>,
  headerStyle: () => ({width: '64px'}),
},{
  dataField: 'type.name',
  text: 'Type',
  sort: true,
},{
  dataField: 'bp_type',
  text: 'Blueprint Type',
  align: 'center',
  headerAlign: 'center',
  formatter: (cell) => cell.charAt(0).toUpperCase() + cell.slice(1),
  headerStyle: () => ({width: '128px'}),
},{
  dataField: 'quantity',
  text: 'Quantity',
  align: 'center',
  headerAlign: 'center',
  formatter: (quantity, {runs, bp_type}) => <span>{
    bp_type === 'copy' ? `${runs} Run(s)`
    : quantity === 0 ? 'N/A'
    : `${quantity} Unit(s)`
  }</span>,
  headerStyle: () => ({width: '128px'}),
}];

const defaultSorted = [{dataField: 'type.name', order: 'asc'}];

const BlueprintTable = ({blueprints}) => <div>
  <BootstrapTable
    columns={columns}
    data={blueprints}
    defaultSorted={defaultSorted}
    keyField='item_id'
    bootstrap4
    hover
    pagination={paginationFactory()}
  />
</div>;

export default BlueprintTable;
