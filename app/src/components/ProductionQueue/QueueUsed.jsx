import React from 'react';
import Image from 'react-bootstrap/Image';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter';
import numeral from 'numeral';

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';

class QueueUsed extends React.Component {
  state = {
    columns: [{
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
      filter: textFilter({id: `text-filter-column-${this.props.queueName}-used-type.name`}),
    },{
      dataField: 'units.asset',
      text: 'Asset Used',
      sort: true,
      align: 'right',
      headerAlign: 'center',
      formatter: (unitsAsset) => numeral(unitsAsset).format('0,0'),
      headerStyle: {width: '100px'},
    },{
      dataField: 'units.industry',
      text: 'Industry Used',
      sort: true,
      align: 'right',
      headerAlign: 'center',
      formatter: (unitsIndustry) => numeral(unitsIndustry).format('0,0'),
      headerStyle: {width: '100px'},
    }],
    defaultSorted: [{dataField: 'type.name', order: 'asc'}],
  };

  render() {
    const {used} = this.props;
    const {columns, defaultSorted} = this.state;

    return <BootstrapTable
      columns={columns}
      data={used}
      defaultSorted={defaultSorted}
      keyField='type.id'
      bootstrap4
      hover
      filter={filterFactory()}
      pagination={paginationFactory()}
    />;
  }
}

export default QueueUsed;
