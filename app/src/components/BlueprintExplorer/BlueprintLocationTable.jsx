import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import numeral from 'numeral';

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';
import BlueprintTable from './BlueprintTable.jsx';
import BlueprintLocationTableExpanded from './BlueprintLocationTableExpanded.jsx';

const columns = [{
  dataField: 'type',
  text: '',
  formatter: (type) => <span>
    <Image
      src={parseTypeImageUrl(type, 32)}
      rounded
    />
  </span>,
  headerStyle: () => ({width: '58px'}),
},{
  dataField: 'name',
  text: 'Name',
  sort: true,
},{
  dataField: 'type.name',
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

const expandRowTemplate = {
  onlyOneExpanding: true,
  showExpandColumn: true,
  expandHeaderColumnRenderer: () => <span></span>,
  expandColumnRenderer: ({expanded}) => <span>
    <FontAwesomeIcon icon={expanded ? faChevronDown : faChevronUp} />
  </span>,
};

const BlueprintLocationTable = ({blueprints, locations, search, type}) => {
  const expandRow = {
    ...expandRowTemplate,
    renderer: (location) => <BlueprintLocationTableExpanded
      location={location}
      search={search}
      type={type}
    />,
  };

  return <Accordion>
    {blueprints.length > 0 && <Card>
      <Accordion.Toggle as={Card.Header} eventKey='blueprints'>
        ({numeral(blueprints.length).format('0,0')}) Blueprints
      </Accordion.Toggle>
      <Accordion.Collapse eventKey='blueprints'>
        <Card.Body><BlueprintTable blueprints={blueprints}/></Card.Body>
      </Accordion.Collapse>
    </Card>}
    {locations.length > 0 && <Card>
      <Accordion.Toggle as={Card.Header} eventKey='locations'>
        ({numeral(locations.reduce((a,i) => a + i.bp_count, 0)).format('0,0')}) Sub-Locations
      </Accordion.Toggle>
      <Accordion.Collapse eventKey='locations'>
        <Card.Body><BootstrapTable
          columns={columns}
          data={locations}
          defaultSorted={defaultSorted}
          expandRow={expandRow}
          keyField='location_id'
          bootstrap4
          hover
          pagination={paginationFactory()}
        /></Card.Body>
      </Accordion.Collapse>
    </Card>}
  </Accordion>;
};

export default BlueprintLocationTable;
