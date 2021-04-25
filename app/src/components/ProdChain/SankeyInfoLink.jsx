import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import numeral from 'numeral';

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';

const SankeyInfoLink = ({link}) => <Alert variant='info' style={{backgroundColor: '#204060'}}>
  <h3><Image
    thumbnail
    src={parseTypeImageUrl(link.material, 64)}
    style={{background: '#000000'}}
  /> {link.material.type_name} ({numeral(link.mat_quant).format('0,0.00')})</h3>
  <hr />
  <Row>
    <Col xs='6'>
      <p>
        <b><u>Units</u></b>: {numeral(link.mat_quant).format('0,0.00')}
      </p>
    </Col>
    <Col xs='6'>
      <p>
        <b><u>Total Volume</u></b>: {numeral(link.mat_vol).format('0,0.00')} m<sup>3</sup>
      </p>
    </Col>
  </Row>
  <Row>
    <Col xs='6'>
      <p>
        <Image
          thumbnail
          src={
            link.source.activity_type === 'purchase' ? 'https://wiki.eveuniversity.org/images/9/9f/Market.png'
            : parseTypeImageUrl(link.source.blueprint, 64)
          }
          style={{background: '#000000'}}
        /> <b><u>Source Process</u></b>: {link.source.blueprint.type_name}
      </p>
    </Col>
    <Col>
      <p>
        <Image
          thumbnail
          src={parseTypeImageUrl(link.target.blueprint, 64)}
          style={{background: '#000000'}}
        /> <b><u>Target Process</u></b>: {link.target.blueprint.type_name}
      </p>
    </Col>
  </Row>
</Alert>;

export default SankeyInfoLink;
