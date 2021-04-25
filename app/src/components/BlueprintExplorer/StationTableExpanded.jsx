import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import {useQuery} from 'react-query';

import fetchBlueprintLocation from './../../fetchers/fetchBlueprintLocation.js';
import numeral from 'numeral';
import BlueprintLocationTable from './BlueprintLocationTable.jsx';
import Loading from './../Loading/Loading.jsx';

const StationTableExpanded = ({station:{station_id, office:{location_id}, bp_counts:{divisions}}, search, type}) => {
  const queryFilter = {location_id, search, type};
  const {data, status} = useQuery(['fetchBlueprintLocation', queryFilter], fetchBlueprintLocation);

  return <Accordion>
    {divisions.map(({division, count}) => <Card key={`${station_id}-${division}`}>
      <Accordion.Toggle as={Card.Header} eventKey={`${station_id}-${division}`}>
        ({numeral(count).format('0,0')}) Hanger Division {division.replace('CorpSAG', '')}
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={`${station_id}-${division}`}>
        <Card.Body>
          {status === 'success' ? <BlueprintLocationTable
            blueprints={data.data.blueprints.filter((blueprint) => blueprint.location.flag === division)}
            locations={data.data.locations.filter((location) => location.parent.flag === division)}
            search={search}
            type={type}
          /> : <Loading />}
        </Card.Body>
      </Accordion.Collapse>
    </Card>)}
  </Accordion>;
};

export default StationTableExpanded;
