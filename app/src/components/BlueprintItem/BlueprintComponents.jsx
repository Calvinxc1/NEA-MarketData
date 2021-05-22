import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import BlueprintComponentList from './BlueprintComponentList.jsx';

const BlueprintComponents = ({activity, materialEfficiency, timeEfficiency, runs}) => <Container>
  <Row>
    <Col xs={4}>
      <BlueprintComponentList
        by='material'
        components={activity.materials}
        materialEfficiency={materialEfficiency}
        activityType={activity.activity_type}
        runs={runs}
      />
    </Col>
    <Col xs={4}>
      <BlueprintComponentList
        by='product'
        components={activity.products}
        runs={runs}
      />
    </Col>
    <Col xs={4}>
      <BlueprintComponentList
        by='skill'
        components={activity.skills}
      />
    </Col>
  </Row>
</Container>;

export default BlueprintComponents;
