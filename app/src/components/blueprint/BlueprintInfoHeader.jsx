import React from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Figure from 'react-bootstrap/Figure';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import {Link} from "react-router-dom";

import buildBpUrl from './../../tools/buildBpUrl.jsx';

const BlueprintInfoHeader = ({blueprint}) => <Row>
  <Col xs={3}>
    <Figure>
      <Figure.Image
        width={128}
        height={128}
        src={`${buildBpUrl(blueprint.type_id, blueprint.bp_type)}?size=128`}
      />
      <Figure.Caption>{blueprint.type_name}</Figure.Caption>
    </Figure>
    <DropdownButton
      as={ButtonGroup}
      id={blueprint.type_id}
      variant='info'
      title='Open Production Chain'
    >
      {blueprint.activities.filter((activity) => activity.products.length > 0)
        .map((activity) => activity.products.map((product) => <Dropdown.Item
          key={product.type_id}
          eventKey={product.type_id}
        ><Link to={`/production/matChain/${product.type_id}`}>
          {activity.activity_type.split('_').map((word) => word[0].toUpperCase() + word.substr(1)).join(' ')}: {product.type_name}
      </Link></Dropdown.Item>))}
    </DropdownButton>
  </Col>

  <Col>
    <h4>Blueprint located at:</h4>
    <Figure>
      <Figure.Image
        width={64}
        height={64}
        src={`https://images.evetech.net/types/${blueprint.parent_station.type_id}/icon?size=64`}
      />
      <Figure.Caption>{blueprint.parent_station.name}</Figure.Caption>
    </Figure>
</Col>

  <Col><ListGroup>
    <ListGroup.Item>Material Efficiency: {blueprint.material_efficiency}</ListGroup.Item>
    <ListGroup.Item>Time Efficiency: {blueprint.time_efficiency}</ListGroup.Item>
    <ListGroup.Item>
      Blueprint Type: {blueprint.bp_type.charAt(0).toUpperCase() + blueprint.bp_type.slice(1)}
    </ListGroup.Item>
    <ListGroup.Item>
      Quantity: {
        blueprint.bp_type === 'copy' ? `${blueprint.runs} Run(s)`
        : blueprint.quantity === 0 ? 'N/A'
        : `${blueprint.quantity} Unit(s)`
      }
    </ListGroup.Item>
    <ListGroup.Item>Max Production Limit: {blueprint.max_production_limit}</ListGroup.Item>
  </ListGroup></Col>
</Row>;

export default BlueprintInfoHeader;
