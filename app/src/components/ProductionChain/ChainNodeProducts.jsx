import React from 'react';
import Image from 'react-bootstrap/Image';
import BootstrapTable from 'react-bootstrap-table-next';
import numeral from 'numeral';

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';

const columns = [{
  dataField: 'type.id',
  text: '',
  sort: true,
  headerAlign: 'center',
  formatter: (typeId, {type}) => <Image
    thumbnail
    src={parseTypeImageUrl(type, 32,
      type.group.category.id === 9 ? 'bpc'
      : type.group.category.id === 34 ? 'relic'
      : 'icon'
    )}
    style={{background: '#000000'}}
  />,
  headerStyle: {width: '64px'},
},{
  dataField: 'type.name',
  text: 'Material',
  sort: true,
},{
  dataField: 'quantity',
  text: 'Units',
  sort: true,
  align: 'right',
  headerAlign: 'center',
  formatter: (quantity) => numeral(quantity).format('0,0.00'),
},{
  dataField: 'output_ratio',
  text: 'Output %',
  sort: true,
  align: 'right',
  headerAlign: 'center',
  formatter: (output_ratio) => numeral(output_ratio).format('0.0%'),
}];

const defaultSorted = [{dataField: 'target.type.id', order: 'asc'}];

const parseProducts = (products) => products.map(({target:{type}, quantity, source:{output_units}}) => {
  return {type, quantity, output_ratio: quantity / output_units};
});

const ChainNodeProducts = ({products}) => <BootstrapTable
  columns={columns}
  data={parseProducts(products)}
  defaultSorted={defaultSorted}
  keyField='type.id'
  noDataIndication='No Outputs'
  bootstrap4
  hover
/>;

export default ChainNodeProducts;
