import React from 'react';
import Image from 'react-bootstrap/Image';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {Link} from 'react-router-dom';
import numeral from 'numeral';
import moment from 'moment';

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';
import QueueListHeader from './QueueListHeader.jsx';

class QueueList extends React.Component {
  state = {queue_ids: []};

  columns = [{
    dataField: 'type',
    text: '',
    formatter: (type, {id}) => <Link to={`/production/queue/${id}`}>
      <Image
        src={parseTypeImageUrl(type, 64,
          type.group.category.id === 9 ? 'bpc'
          : type.group.category.id === 34 ? 'relic'
          : 'icon'
        )}
        thumbnail
      />
    </Link>,
    headerStyle: {width: '88px'},
  },{
    dataField: 'type.name',
    text: 'Product',
    sort: true,
  },{
    dataField: 'station.name',
    text: 'Station',
    sort: true,
  },{
    dataField: 'units',
    text: 'Units',
    sort: true,
    align: 'right',
    headerAlign: 'center',
    formatter: (units) => numeral(units).format('0,0'),
    headerStyle: {width: '100px'},
  },{
    dataField: 'created',
    text: 'Created On',
    sort: true,
    align: 'center',
    headerAlign: 'center',
    formatter: (created) => moment(created).format('YYYY-MM-DD HH:mm:ss'),
    headerStyle: {width: '180px'},
  }];

  defaultSorted = [{dataField: 'type.name', order: 'asc'}];

  selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    onSelect: ({id}, isSelect) => this.updateSelected(id, isSelect),
    onSelectAll: (isSelect, rows) => rows.forEach(({id}) => this.updateSelected(id, isSelect)),
    style: {backgroundColor: '#888888'},
  };

  updateSelected = (id, isSelect) => {
    if(isSelect) {
      this.setState(({queue_ids}) => ({queue_ids: [...queue_ids, id]}))
    } else {
      this.setState(({queue_ids}) => ({queue_ids: queue_ids.filter((e) => e !== id)}));
    }
  };

  render() {
    const {queue, refetch} = this.props;
    const {queue_ids} = this.state;

    return <div>
      <QueueListHeader
        queue_ids={queue_ids}
        refetch={refetch}
        updateSelected={this.updateSelected}
      />
      <BootstrapTable
        columns={this.columns}
        data={queue}
        defaultSorted={this.defaultSorted}
        selectRow={this.selectRow}
        keyField='id'
        bootstrap4
        hover
        pagination={paginationFactory()}
      />
    </div>;
  }
}

export default QueueList;
