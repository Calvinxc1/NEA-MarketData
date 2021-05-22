import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import {connect} from 'react-redux';

import {setRuns} from './../../store/actions/blueprintItem.js';
import BlueprintActivityToggle from './BlueprintActivityToggle.jsx';
import BlueprintComponents from './BlueprintComponents.jsx';

const BlueprintActivities = ({activities, material_efficiency, time_efficiency, max_production_limit, runs, setRuns}) => <Accordion className='shadow-sm'>
  <Card.Header><Row>
    <Col xs={2}>
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>Runs</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          type='number'
          min={1}
          max={max_production_limit}
          value={runs}
          onChange={(e) => setRuns(Number(e.target.value))}
        />
      </InputGroup>
    </Col>
    <Col xs={10}>
      <Row align='center'>
        {activities.map((activity) => <BlueprintActivityToggle
          activity={activity}
          activityCount={activities.length}
          eventKey={activity.activity_type}
          key={activity.activity_type}
        />)}
      </Row>
    </Col>
  </Row>
  </Card.Header>
  {activities.map((activity) => <Accordion.Collapse
    eventKey={activity.activity_type}
    style={{border: '1px solid #000000'}}
    key={activity.activity_type}
  ><BlueprintComponents
    key={activity.activity_type}
    activity={activity}
    materialEfficiency={material_efficiency}
    timeEfficiency={time_efficiency}
    runs={runs}
  /></Accordion.Collapse>)}
</Accordion>;

const mapStateToProps = ({blueprintItem:{runs}}) => {
  return {runs};
};

export default connect(mapStateToProps, {setRuns})(BlueprintActivities);
