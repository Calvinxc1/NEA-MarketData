import React from 'react';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';

const InfoNodeHeaderDropdown = ({item}) => <Row>
  <Col xs='auto'>
    <Image
      thumbnail
      src={parseTypeImageUrl(item.type, 64,
        item.bp_type === 'original' ? 'bp'
        : item.bp_type === 'copy' ? 'bpc'
        : item.bp_type === 'relic' ? 'relic'
        : 'bpc'
      )}
      style={{background: '#000000'}}
    />
  </Col>
  <Col style={{textAlign: 'center'}}>
    <h3>{item.bp_type[0].toUpperCase() + item.bp_type.substr(1)}: {item.type.name}</h3>
    <Row>
      <Col>ME: {item.material_efficiency}</Col>
      <Col>TE: {item.time_efficiency}</Col>
      <Col>Runs: {
        item.bp_type === 'original' ? 'N/A'
        : item.bp_type === 'copy' ? item.runs
        : item.bp_type === 'relic' ? item.quantity
        : 'N/A'
      }</Col>
    </Row>
  </Col>
</Row>;

export default InfoNodeHeaderDropdown;
