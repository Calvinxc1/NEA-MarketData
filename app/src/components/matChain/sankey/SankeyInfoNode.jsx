import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import numeral from 'numeral'

const SankeyInfoNode = ({node}) => <Alert variant='info' style={{backgroundColor: '#204060'}}>
  <h3>{node.bp_type_name}</h3>
  <hr />
  <Row>
    <Col xs='6'>
      <p>
        <b><u>Activity Type</u></b>: {node.activity_type.split('_').map((word) => word[0].toUpperCase() + word.substr(1)).join(' ')}
      </p>
      <p>
        <b><u>Runs</u></b>: {numeral(node.runs).format('0,0.00')}
      </p>
    </Col>
    <Col>
      <p>
        <b><u>Output</u></b>: <Image
          thumbnail
          src={`https://images.evetech.net/types/${node.prod_type_id}/icon?size=32`}
          style={{background: '#000000'}}
        /> {node.prod_type_name}
      </p>
      <p>
        <b><u>Output Units</u></b>: {numeral(node.output_target).format('0,0.00')}
      </p>
    </Col>
  </Row>
  <Row>
    <Col xs='6'>
      <p style={{textAlign: 'center'}}><b><u>Input(s)</u></b></p>
      <ListGroup>
        {node.targetLinks.map((link) => <ListGroup.Item style={{background: '#2171b5'}} key={link.mat_type_id}>
          <Image
            thumbnail
            src={`https://images.evetech.net/types/${link.mat_type_id}/icon?size=32`}
            style={{background: '#000000'}}
          /> {link.source.prod_type_name} ({numeral(link.mat_needs).format('0,0.00')})
        </ListGroup.Item>)}
      </ListGroup>
    </Col>
    <Col xs='6'>
      <p style={{textAlign: 'center'}}><b><u>Output Destination(s)</u></b></p>
      <ListGroup>
        {node.sourceLinks.map((link) => <ListGroup.Item style={{background: '#2171b5'}} key={link.prod_type_id}>
          {link.target.prod_type_name} (
            {numeral(link.mat_needs).format('0,0.00')}, {numeral(link.mat_needs/node.output_target).format('0.0%')}
          )
        </ListGroup.Item>)}
      </ListGroup>
    </Col>
  </Row>
</Alert>;

export default SankeyInfoNode;
