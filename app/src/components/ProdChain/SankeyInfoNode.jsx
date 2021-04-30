import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import numeral from 'numeral';

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';
import SankeyInfoNodeMaterials from './SankeyInfoNodeMaterials.jsx';
import SankeyInfoNodeProducts from './SankeyInfoNodeProducts.jsx';

const SankeyInfoNode = ({node}) => <Alert variant='info' style={{backgroundColor: '#204060'}}>
  <h3>{node.type.name}</h3>
  <hr />
  <Row>
    <Col xs='6'>
      <p>
        <b><u>Activity Type</u></b>: {node.activity.type.split('_').map((word) => word[0].toUpperCase() + word.substr(1)).join(' ')}
      </p>
      <p>
        <b><u>Runs</u></b>: {numeral(node.output_runs).format('0,0.00')}
      </p>
    </Col>
    <Col>
      <p>
        <b><u>Output</u></b>: <Image
          thumbnail
          src={parseTypeImageUrl(node.product.type, 32,
            node.product.type.group.category.id === 9 ? 'bpc' : 'icon'
          )}
          style={{background: '#000000'}}
        /> {node.product.type.name}
      </p>
      <p>
        <b><u>Output Units</u></b>: {numeral(node.output_units).format('0,0.00')}
      </p>
    </Col>
  </Row>
  <Row>
    <Col xs='6'>
      <p style={{textAlign: 'center'}}><b><u>Input Material(s)</u></b></p>
      <div style={{backgroundColor: '#0570b0'}}>
        <SankeyInfoNodeMaterials materials={node.targetLinks} />
      </div>
    </Col>
    <Col xs='6'>
      <p style={{textAlign: 'center'}}><b><u>Output Process(es)</u></b></p>
      <div style={{backgroundColor: '#0570b0'}}>
        <SankeyInfoNodeProducts products={node.sourceLinks} />
      </div>
    </Col>
  </Row>
</Alert>;

export default SankeyInfoNode;
