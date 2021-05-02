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
    src={parseTypeImageUrl(link.material.type, 64,
      link.material.type.group.category.id === 9 ? 'bpc'
      : link.material.type.group.category.id === 34 ? 'relic'
      : 'icon'
    )}
    style={{background: '#000000'}}
  /> {link.material.type.name}</h3>
  <hr />
  <Row>
    <Col xs='6'>
      <p>
        <b><u>Units</u></b>: {numeral(link.units).format('0,0.00')} ({numeral(link.available_units).format('0,0')} available)
      </p>
    </Col>
    <Col xs='6'>
      <p>
        <b><u>Total Volume</u></b>: {numeral(link.units * link.material.type.mass).format('0,0.00')} m<sup>3</sup>
      </p>
    </Col>
  </Row>
  <Row>
    <Col xs='6'>
      <p>
        <Image
          thumbnail
          src={link.source.activity.type === 'purchase' ? 'https://wiki.eveuniversity.org/images/9/9f/Market.png'
          : parseTypeImageUrl(link.source.type, 64,
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

export default SankeyInfoLink;
