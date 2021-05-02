import React from 'react';
import Image from 'react-bootstrap/Image';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import {useQuery} from 'react-query';
import numeral from 'numeral';

import fetchBlueprintLocation from './../../fetchers/fetchBlueprintLocation.js';
import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';
import StationTableExpanded from './StationTableExpanded.jsx';
import Loading from './../Loading/Loading.jsx';

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
},{
  dataField: 'bp_counts.station',
  text: "BP's",
  sort: true,
  align: 'right',
  headerAlign: 'center',
  headerStyle: () => ({width: '128px'}),
  formatter: (bp_count) => numeral(bp_count).format('0,0'),
}];

const defaultSorted = [{dataField: 'name', order: 'asc'}];

const expandRowTemplate = {
  onlyOneExpanding: true,
  showExpandColumn: true,
  expandHeaderColumnRenderer: () => <span></span>,
  expandColumnRenderer: ({expanded}) => <span>
    <FontAwesomeIcon icon={expanded ? faChevronDown : faChevronUp} />
  </span>,
};

const queryWrapper = (Component) => (props) => {
  const queryFilter = {search: props.search, type: props.type};
  const {data, status} = useQuery(['fetchBlueprintLocation', queryFilter], fetchBlueprintLocation);
  return status === 'success' ? <Component {...props} locations={data.data} /> : <Loading />;
};

const StationTable = ({locations, search, type}) => {
  const expandRow = {
    ...expandRowTemplate,
    renderer: (station) => <StationTableExpanded
      station={station}
      search={search}
      type={type}
    />,
  };

  return <BootstrapTable
    columns={columns}
    data={locations}
    defaultSorted={defaultSorted}
    expandRow={expandRow}
    keyField='station_id'
    bootstrap4
    hover
    pagination={paginationFactory()}
  />;
};

export default queryWrapper(StationTable);
