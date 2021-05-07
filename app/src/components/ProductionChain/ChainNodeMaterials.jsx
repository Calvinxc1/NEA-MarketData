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
  text: 'Required',
  sort: true,
  align: 'right',
  headerAlign: 'center',
  formatter: (quantity) => numeral(quantity).format('0,0'),
},{
  dataField: 'available_quantity',
  text: 'Available',
  sort: true,
  align: 'right',
  headerAlign: 'center',
  formatter: (available_quantity) => {
    if(available_quantity) {
      if(available_quantity <= 0) {
        return <span>
          {numeral(-available_quantity).format('0,0')} (BPo)
        </span>;
      } else {
        return numeral(available_quantity).format('0,0');
      }
    } else {
      return 0;
    }
  },
}];

const defaultSorted = [{dataField: 'type.id', order: 'asc'}];

const parseMaterials = (materials) => materials.map(({type, quantity, available_quantity}) => {
  return {type, quantity, available_quantity};
});

const ChainNodeMaterials = ({materials}) => <BootstrapTable
  columns={columns}
  data={parseMaterials(materials)}
  defaultSorted={defaultSorted}
  keyField='type.id'
  noDataIndication='No Inputs'
  bootstrap4
  hover
/>;

export default ChainNodeMaterials;
