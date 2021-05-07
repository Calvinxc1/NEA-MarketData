import React from 'react';
import Image from 'react-bootstrap/Image';
import Jumbotron from 'react-bootstrap/Jumbotron';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, {selectFilter, textFilter} from 'react-bootstrap-table2-filter';
import numeral from 'numeral';

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';

const columns = [{
  dataField: 'type',
  text: '',
  formatter: (type, {id}) => <Image
    src={parseTypeImageUrl(type, 32,
      type.group.category.id === 9 ? 'bpc'
      : type.group.category.id === 34 ? 'relic'
      : 'icon'
    )}
    rounded
  />,
  headerStyle: {width: '50px'},
},{
  dataField: 'type.name',
  text: 'Product',
  sort: true,
  filter: textFilter(),
},{
  dataField: 'process.0.activity.type',
  text: 'Activity',
  sort: true,
  align: 'center',
  headerAlign: 'center',
  formatter: (activity_type) => activity_type.split('_').map((word) => word[0].toUpperCase() + word.substr(1)).join(' '),
  headerStyle: {width: '165px'},
  filter: selectFilter({
    options: {
      purchase: 'Purchase',
      manufacturing: 'Manufacturing',
      copying: 'Copying',
      invention: 'Invention',
    },
  })
},{
  dataField: 'units.required',
  text: 'Required',
  sort: true,
  align: 'right',
  headerAlign: 'center',
  formatter: (units) => numeral(units).format('0,0'),
  headerStyle: {width: '100px'},
},{
  dataField: 'units.available',
  text: 'Available',
  sort: true,
  align: 'right',
  headerAlign: 'center',
  formatter: (units) => numeral(units).format('0,0'),
  headerStyle: {width: '100px'},
},{
  dataField: 'units.needed',
  text: 'Needed',
  sort: true,
  align: 'right',
  headerAlign: 'center',
  formatter: (units) => numeral(units).format('0,0'),
  headerStyle: {width: '100px'},
}]

const defaultSorted = [{dataField: 'type.name', order: 'asc'}];

const QueueNeeds = ({needs}) => <Jumbotron>
  <h3>Needed Components</h3>
  <BootstrapTable
    columns={columns}
    data={needs}
    defaultSorted={defaultSorted}
    keyField='type.id'
    bootstrap4
    hover
    filter={filterFactory()}
  />
</Jumbotron>;

export default QueueNeeds;
