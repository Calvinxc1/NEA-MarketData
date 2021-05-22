import React from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Figure from 'react-bootstrap/Figure';
import Row from 'react-bootstrap/Row';
import {Link} from "react-router-dom";

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';
import BlueprintSummaryTable from './BlueprintSummaryTable.jsx';

const BlueprintHeader = ({blueprint}) => <Row>
  <Col xs={3}>
    <Figure>
      <Figure.Image
        width={128}
        height={128}
        src={parseTypeImageUrl(blueprint.type, 128, blueprint.function)}
      />
      <Figure.Caption>{blueprint.type.name}</Figure.Caption>
    </Figure>
  </Col>

  <Col>
    <h4>Blueprint located at:</h4>
    <Figure>
      <Figure.Image
        width={64}
        height={64}
        src={parseTypeImageUrl(blueprint.station.type, 64)}
      />
      <Figure.Caption>{blueprint.station.name}</Figure.Caption>
    </Figure>
    <DropdownButton
      as={ButtonGroup}
      id={blueprint.type.id}
      variant='info'
      title='Open Production Chain'
    >
      {blueprint.activities.filter((activity) => activity.products.length > 0)
        .map((activity) => activity.products.map((product) => <Dropdown.Item
          as={Link}
          to={`/production/chain/${product.type.id}`}
          key={product.type.id}
          eventKey={product.type.id}
        >
          {activity.activity_type.split('_').map((word) => word[0].toUpperCase() + word.substr(1)).join(' ')}: {product.type.name}
      </Dropdown.Item>))}
    </DropdownButton>
  </Col>

  <Col>
    <BlueprintSummaryTable blueprint={blueprint} />
  </Col>
</Row>;

export default BlueprintHeader;
