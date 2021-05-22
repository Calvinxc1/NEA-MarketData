import React from 'react';
import Image from 'react-bootstrap/Image';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, {selectFilter, textFilter} from 'react-bootstrap-table2-filter';
import numeral from 'numeral';

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';

class QueueNeeds extends React.Component {
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
      headerAlign: 'center',
      headerStyle: {width: '50px'},
    },{
      dataField: 'type.name',
      text: 'Product',
      sort: true,
      filter: textFilter({id: `text-filter-column-${this.props.queueName}-needs-type.name`}),
    },{
      dataField: 'process.0.activity.type',
      text: 'Activity',
      sort: true,
      align: 'center',
      headerAlign: 'center',
      formatter: (activity_type) => activity_type.split('_')
        .map((word) => word[0].toUpperCase() + word.substr(1))
        .join(' '),
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
      dataField: 'units',
      text: 'Needed',
      sort: true,
      align: 'right',
      headerAlign: 'center',
      formatter: ({required, available, needed}) => {
        const use_need = needed > 0 ? needed
          : required - available.asset;

        return numeral(use_need).format('0,0');
      },
      headerStyle: {width: '100px'},
    }],
    defaultSorted: [{dataField: 'type.name', order: 'asc'}],
    rowStyle: ({units:{needed}}) => ({
      color: needed > 0 ? '#FFFFFF' : '#2ca25f',
    }),
  };

  render() {
    const {needs} = this.props;
    const {columns, defaultSorted, rowStyle} = this.state;

    return <div>
      <BootstrapTable
        columns={columns}
        data={needs}
        defaultSorted={defaultSorted}
        rowStyle={rowStyle}
        keyField='type.id'
        bootstrap4
        hover
        filter={filterFactory()}
        pagination={paginationFactory()}
      />
    </div>;
  }
}

export default QueueNeeds;
