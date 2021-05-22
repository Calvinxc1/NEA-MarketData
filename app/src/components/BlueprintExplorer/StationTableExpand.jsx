import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import {useQuery} from 'react-query';
import {connect} from 'react-redux';

import getBlueprintLocation from './../../api/getBlueprintLocation.js';
import numeral from 'numeral';
import LocationItems from './LocationItems.jsx';
import Loading from './../Loading/Loading.jsx';

const queryWrapper = (Component) => (props) => {
  const queryFilter = {
    location_id: props.office.location_id,
    search: props.search,
    type: props.type,
    station_ids: [props.station_id],
  };
  const {data, status} = useQuery(['getBlueprintLocation', queryFilter], getBlueprintLocation);
  return <Component {...props} data={data} status={status} />;
};

const divisions = ['CorpSAG1', 'CorpSAG2', 'CorpSAG3', 'CorpSAG4', 'CorpSAG5', 'CorpSAG6', 'CorpSAG7'];

const StationTableExpand = ({station_id, data, status}) => status === 'success' ? <Accordion>
  {divisions.map((division) => {
    const blueprints = data.data.blueprints.filter((blueprint) => blueprint.location.flag === division);
    const locations = data.data.locations.filter((location) => location.parent.flag === division);
    const bpCount = blueprints.length + locations.reduce((acc, location) => acc + location.blueprint_count, 0);

    return bpCount > 0 && <Card key={`${station_id}-${division}`}>
      <Accordion.Toggle as={Card.Header} eventKey={`${station_id}-${division}`}>
        ({numeral(bpCount).format('0,0')}) Hanger Division {division.replace('CorpSAG', '')}
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={`${station_id}-${division}`}>
        <Card.Body>
          <LocationItems
            blueprints={blueprints}
            locations={locations}
            station_id={station_id}
          />
        </Card.Body>
      </Accordion.Collapse>
    </Card>;
  })}
</Accordion>
: <Loading />;

const mapStateToProps = ({blueprintExplorer:{search, type}}) => {
  return {search, type};
};

export default connect(mapStateToProps)(queryWrapper(StationTableExpand));
