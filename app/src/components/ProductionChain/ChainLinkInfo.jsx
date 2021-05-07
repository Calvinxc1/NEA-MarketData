import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import numeral from 'numeral';

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';

const ChainLinkInfo = ({link}) => <Alert variant='info' style={{backgroundColor: '#204060'}}>
  <h3><Image
    thumbnail
    src={parseTypeImageUrl(link.type, 64,
      link.type.group.category.id === 9 ? 'bpc'
      : link.type.group.category.id === 34 ? 'relic'
      : 'icon'
    )}
    style={{background: '#000000'}}
  /> {link.type.name}</h3>
  <hr />
  <Row>
    <Col xs='6'>
      <p>
        <b><u>Units</u></b>: {numeral(link.quantity).format('0,0.00')} ({numeral(link.available_quantity).format('0,0')} available)
      </p>
    </Col>
    <Col xs='6'>
      <p>
        <b><u>Total Volume</u></b>: {numeral(link.quantity * link.type.volume).format('0,0.00')} m<sup>3</sup>
      </p>
    </Col>
  </Row>
  <Row>
    <Col xs='6'>
      <p>
        <Image
          thumbnail
          src={parseTypeImageUrl(link.source.type, 64,
            link.source.type.group.category.id === 9 ? 'bpc'
            : link.source.type.group.category.id === 34 ? 'relic'
            : 'icon'
          )}
          style={{background: '#000000'}}
        /> <b><u>Source Process</u></b>: {link.source.type.name}
      </p>
    </Col>
    <Col>
      <p>
        <Image
          thumbnail
          src={parseTypeImageUrl(link.target.type, 64,
            link.target.type.group.category.id === 9 ? 'bpc'
            : link.target.type.group.category.id === 34 ? 'relic'
            : 'icon'
          )}
          style={{background: '#000000'}}
        /> <b><u>Target Process</u></b>: {link.target.type.name}
      </p>
    </Col>
  </Row>
</Alert>;

export default ChainLinkInfo;
