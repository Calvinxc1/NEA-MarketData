import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import numeral from 'numeral';

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';
import InfoNodeHeaderDropdown from './InfoNodeHeaderDropdown.jsx';
import SankeyInfoNodeMaterials from './SankeyInfoNodeMaterials.jsx';
import SankeyInfoNodeProducts from './SankeyInfoNodeProducts.jsx';

const SankeyInfoNode = ({node, bp_items, updateBlueprintItems}) => <Alert variant='info' style={{backgroundColor: '#204060'}}>
  {node.activity.type !== 'purchase' ? <Dropdown>
    <Dropdown.Toggle variant='primary' style={{width: '100%'}}>
      <InfoNodeHeaderDropdown item={node.items.selected} />
    </Dropdown.Toggle>
    <Dropdown.Menu style={{width: '100%', align: 'center'}}>
      {node.items.options.map((item) => <Dropdown.Item
        key={item.item_id}
        onClick={() => {
          let newBpItems = {...bp_items};
          newBpItems[node.product.type.id] = item.item_id;
          updateBlueprintItems(newBpItems);
        }}
      ><InfoNodeHeaderDropdown item={item} /></Dropdown.Item>)}
    </Dropdown.Menu>
  </Dropdown>
  : <Row>
    <Col xs='auto'>
      <Image
        thumbnail
        src='https://wiki.eveuniversity.org/images/9/9f/Market.png'
        style={{background: '#000000'}}
      />
    </Col>
    <Col>
      <h3>Purchase</h3>
    </Col>
  </Row>}
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
            node.product.type.group.category.id === 9 ? 'bpc'
            : node.product.type.group.category.id === 34 ? 'relic'
            : 'icon'
          )}
          style={{background: '#000000'}}
        /> {node.product.type.name}
      </p>
      <p>
        <b><u>Output Units</u></b>: {numeral(node.output_units).format('0,0.00')} / {numeral(node.available_units).format('0,0')} available
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
