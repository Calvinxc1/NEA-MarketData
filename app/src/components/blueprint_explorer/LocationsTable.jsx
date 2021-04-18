import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons'
import numeral from 'numeral';

import BlueprintsTable from './BlueprintsTable.jsx'

const columns = [{
  dataField: 'type_id',
  text: '',
  formatter: (cell, {location_flag}) => <span>
    {location_flag !== 'OfficeFolder' && <Image
      src={`https://images.evetech.net/types/${cell}/icon?size=32`}
      thumbnail
    />}
  </span>,
  headerStyle: () => ({width: '64px'}),
},{
  dataField: 'name',
  text: 'Name',
  sort: true,
},{
  dataField: 'type_name',
  text: 'Type',
  sort: true,
},{
  dataField: 'bp_count',
  text: "BP's",
  sort: true,
  align: 'right',
  headerAlign: 'center',
  headerStyle: () => ({width: '128px'}),
  formatter: (bp_count) => numeral(bp_count).format('0,0'),
}];

const defaultSorted = [{dataField: 'name', order: 'asc'}];
const expandRow = {
  onlyOneExpanding: true,
  renderer: (row) => <Accordion>
    {row.blueprints.length > 0 && <Card>
      <Accordion.Toggle as={Card.Header} eventKey="blueprints">
        Blueprints ({numeral(row.blueprints.length).format('0,0')})
      </Accordion.Toggle>
      <Accordion.Collapse eventKey="blueprints">
        <Card.Body><BlueprintsTable data={row.blueprints} /></Card.Body>
      </Accordion.Collapse>
    </Card>}
    {row.children.length > 0 && <Card>
      <Accordion.Toggle as={Card.Header} eventKey="locations">
        Locations ({numeral(row.bp_count - row.blueprints.length).format('0,0')})
      </Accordion.Toggle>
      <Accordion.Collapse eventKey="locations">
        <Card.Body><LocationsTable data={row.children} /></Card.Body>
      </Accordion.Collapse>
    </Card>}
  </Accordion>,
  showExpandColumn: true,
  expandColumnRenderer: ({expanded}) => <div>
    {expanded ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}
  </div>,
  expandHeaderColumnRenderer: () => undefined,
};

const LocationsTable = (props) => <div>

  <BootstrapTable
    columns={columns}
    data={props.data}
    defaultSorted={defaultSorted}
    expandRow={expandRow}
    keyField="id"
    bootstrap4
    hover
    pagination={paginationFactory()}
  />
</div>;

export default LocationsTable;
