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
  dataField: 'units',
  text: 'Required',
  sort: true,
  align: 'right',
  headerAlign: 'center',
  formatter: (units) => numeral(units).format('0,0.00'),
},{
  dataField: 'available_units',
  text: 'Available',
  sort: true,
  align: 'right',
  headerAlign: 'center',
  formatter: (available_units) => numeral(available_units).format('0,0'),
}];

const defaultSorted = [{dataField: 'type.id', order: 'asc'}];

const parseMaterials = (materials) => materials.map(({material:{type}, units, available_units}) => {
  return {type, units, available_units};
});

const SankeyInfoNodeMaterials = ({materials}) => <BootstrapTable
  columns={columns}
  data={parseMaterials(materials)}
  defaultSorted={defaultSorted}
  keyField='type.id'
  noDataIndication='No Inputs'
  bootstrap4
  hover
/>;

export default SankeyInfoNodeMaterials;
