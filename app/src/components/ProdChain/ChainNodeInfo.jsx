import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import numeral from 'numeral';

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';
import ChainNodeMaterials from './ChainNodeMaterials.jsx';
import ChainNodeProducts from './ChainNodeProducts.jsx';

const ChainNodeInfo = ({node, bp_items, updateBlueprintItems}) => <Alert variant='info' style={{backgroundColor: '#204060'}}>
  <hr />
  <Row>
    <Col xs='6'>
      <p>
        <b><u>Activity Type</u></b>: {node.process[0].activity.type.split('_').map((word) => word[0].toUpperCase() + word.substr(1)).join(' ')}
      </p>
      <p>
        <b><u>Runs</u></b>: {numeral(node.output_runs).format('0,0.00')}
      </p>
    </Col>
    <Col>
      <p>
        <b><u>Output</u></b>: <Image
          thumbnail
          src={parseTypeImageUrl(node.type, 32,
            node.type.group.category.id === 9 ? 'bpc'
            : node.type.group.category.id === 34 ? 'relic'
            : 'icon'
          )}
          style={{background: '#000000'}}
        /> {node.type.name}
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
        <ChainNodeMaterials materials={node.targetLinks} />
      </div>
    </Col>
    <Col xs='6'>
      <p style={{textAlign: 'center'}}><b><u>Output Process(es)</u></b></p>
      <div style={{backgroundColor: '#0570b0'}}>
        <ChainNodeProducts products={node.sourceLinks} />
      </div>
    </Col>
  </Row>
</Alert>;

export default ChainNodeInfo;
