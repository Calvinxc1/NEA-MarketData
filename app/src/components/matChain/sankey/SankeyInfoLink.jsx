import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';

const SankeyInfoLink = ({link}) => <Alert variant='info' style={{backgroundColor: '#204060'}}>
  <h3><Image
    thumbnail
    src={`https://images.evetech.net/types/${link.mat_type_id}/icon?size=64`}
    style={{background: '#000000'}}
  /> {link.mat_type_name} ({link.mat_needs})</h3>
  <hr />
  <Row>
    <Col xs='6'>
      <p>
        <b><u>Source Process</u></b>: {link.source.bp_type_name}
      </p>
    </Col>
    <Col>
      <p>
        <b><u>Target Process</u></b>: {link.target.bp_type_name}
      </p>
    </Col>
  </Row>
</Alert>;

export default SankeyInfoLink;
