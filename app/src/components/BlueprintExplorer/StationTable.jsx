import React from 'react';
import Image from 'react-bootstrap/Image';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import numeral from 'numeral';

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';
import StationTableExpand from './StationTableExpand.jsx';

const columns = [{
  dataField: 'type',
  text: '',
  formatter: (type) => <span>
    <Image
      src={parseTypeImageUrl(type, 64)}
      rounded
    />
  </span>,
  headerStyle: () => ({width: '88px'}),
},{
  dataField: 'name',
  text: 'Name',
  sort: true,
},{
  dataField: 'type.name',
  text: 'Type',
  sort: true,
  headerStyle: () => ({width: '256px'}),
},{
  dataField: 'blueprint_count',
  text: "BP's",
  sort: true,
  align: 'right',
  headerAlign: 'center',
  headerStyle: () => ({width: '128px'}),
  formatter: (blueprint_count) => numeral(blueprint_count).format('0,0'),
}];

const defaultSorted = [{dataField: 'name', order: 'asc'}];

const expandRow = {
  onlyOneExpanding: true,
  showExpandColumn: true,
  expandHeaderColumnRenderer: () => <span></span>,
  expandColumnRenderer: ({expanded}) => <span>
    <FontAwesomeIcon icon={expanded ? faChevronDown : faChevronUp} />
  </span>,
  renderer: ({station_id, office}) => <StationTableExpand
    station_id={station_id}
    office={office}
  />,
};

const StationTable = ({locations}) => <BootstrapTable
  columns={columns}
  data={locations}
  defaultSorted={defaultSorted}
  expandRow={expandRow}
  keyField='station_id'
  bootstrap4
  hover
  pagination={paginationFactory()}
/>;

export default StationTable;
