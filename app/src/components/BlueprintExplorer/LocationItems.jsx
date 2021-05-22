import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import numeral from 'numeral';

import BlueprintTable from './BlueprintTable.jsx';
import LocationTable from './LocationTable.jsx';

const LocationItems = ({blueprints, locations, station_id}) => <Accordion>
  {blueprints.length > 0 && <Card>
    <Accordion.Toggle as={Card.Header} eventKey={`${station_id}-blueprints`}>
      ({numeral(blueprints.length).format('0,0')}) Blueprints
    </Accordion.Toggle>
    <Accordion.Collapse eventKey={`${station_id}-blueprints`}>
      <Card.Body>
        <BlueprintTable blueprints={blueprints}/>
      </Card.Body>
    </Accordion.Collapse>
  </Card>}
  {locations.length > 0 && <Card>
    <Accordion.Toggle as={Card.Header} eventKey={`${station_id}-locations`}>
      ({numeral(locations.reduce((a,i) => a + i.blueprint_count, 0)).format('0,0')}) Sub-Locations
    </Accordion.Toggle>
    <Accordion.Collapse eventKey={`${station_id}-locations`}>
      <Card.Body>
        <LocationTable locations={locations} station_id={station_id} />
      </Card.Body>
    </Accordion.Collapse>
  </Card>}
</Accordion>;

export default LocationItems;
