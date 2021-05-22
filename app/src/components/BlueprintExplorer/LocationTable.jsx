import React from 'react';
import Image from 'react-bootstrap/Image';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import numeral from 'numeral';

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';
import LocationTableExpand from './LocationTableExpand.jsx';

const columns = [{
  dataField: 'type',
  text: '',
  formatter: (type) => <span>
    <Image
      src={parseTypeImageUrl(type, 32)}
      rounded
    />
  </span>,
  headerStyle: {width: '58px'},
},{
  dataField: 'name',
  text: 'Name',
  sort: true,
},{
  dataField: 'type.name',
  text: 'Type',
  sort: true,
},{
  dataField: 'blueprint_count',
  text: "BP's",
  sort: true,
  align: 'right',
  headerAlign: 'center',
  headerStyle: {width: '128px'},
  formatter: (blueprint_count) => numeral(blueprint_count).format('0,0'),
}];

const defaultSorted = [{dataField: 'name', order: 'asc'}];

const expandRowTemplate = {
  onlyOneExpanding: true,
  showExpandColumn: true,
  expandHeaderColumnRenderer: () => <span></span>,
  expandColumnRenderer: ({expanded}) => <FontAwesomeIcon icon={expanded ? faChevronDown : faChevronUp} />,

};

const LocationTable = ({locations, station_id}) => {
  const expandRow = {
    ...expandRowTemplate,
    renderer: (location) => <LocationTableExpand
      location={location}
      station_id={station_id}
    />,
  };

  return <BootstrapTable
    columns={columns}
    data={locations}
    defaultSorted={defaultSorted}
    expandRow={expandRow}
    keyField='location_id'
    bootstrap4
    hover
    pagination={paginationFactory()}
  />;
};

export default LocationTable;
