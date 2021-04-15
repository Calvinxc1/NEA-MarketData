import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import BlueprintActivityToggle from './BlueprintActivityToggle.jsx';
import BlueprintInfoComponents from './BlueprintInfoComponents.jsx';
import BlueprintInfoSkills from './BlueprintInfoSkills.jsx';

const BlueprintInfoActivity = ({activity, runVal, maxProdLimit, updateRuns, materialEfficiency, timeEfficiency}) => <Card key={activity.activity_type}>
  <Card.Header>
    <BlueprintActivityToggle
      eventKey={activity.activity_type}
      runVal={runVal}
      maxProdLimit={maxProdLimit}
      updateRuns={updateRuns}
      prodTime={activity.time}
      timeEfficiency={timeEfficiency}
    >
      {activity.activity_type.split('_').map((word) => word[0].toUpperCase() + word.substr(1)).join(' ')}
    </BlueprintActivityToggle>
  </Card.Header>
  <Accordion.Collapse eventKey={activity.activity_type}>
    <Container>
      <Row>
        <Col xs={4}>
          <BlueprintInfoComponents
            by='product'
            components={activity.materials}
            materialEfficiency={materialEfficiency}
            runs={runVal}
            activityType={activity.activity_type}
          />
        </Col>
        <Col xs={4}>
          <BlueprintInfoComponents
            by='material'
            components={activity.products}
            runs={runVal}
          />
        </Col>
        <Col xs={4}>
          <BlueprintInfoSkills skills={activity.skills} runs={runVal} />
        </Col>
      </Row>
    </Container>
  </Accordion.Collapse>
</Card>;

export default BlueprintInfoActivity;
