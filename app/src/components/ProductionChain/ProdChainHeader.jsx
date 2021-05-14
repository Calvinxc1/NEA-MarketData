import React from 'react';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import {connect} from 'react-redux';
import chroma from 'chroma-js';

import activityColor from './helpers/activityColor.js';
import {setLinkWeight, setUnits, setActiveElement} from './../../store/actions/productionChain.js';
import ModalSaveQueue from './ModalSaveQueue.jsx';

const linkWeightOptions = [{
  value: 'volume',
  name: 'Volume',
},{
  value: 'quantity',
  name: 'Quantity',
}];

const legendItems = ['purchase', 'manufacturing', 'copying', 'invention'];

const ProdChainHeader = ({status, data, linkWeight, setLinkWeight, units, setUnits, setActiveElement}) => <div>
  <h3>Production Chain Diagram</h3>
  <Row>
    <Col xs='4'>
      {legendItems.map((legendItem) => <span key={legendItem}><span
        style={{color: chroma(activityColor(legendItem)).darken(0.5).hex()}}
      >{legendItem.split('_').map((word) => word[0].toUpperCase() + word.substr(1)).join(' ')}</span> | </span>)}
    </Col>
    <Col xs='4'>
      {status === 'success' && <ModalSaveQueue data={data.data} />}
    </Col>
    <Col xs='2'>
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>Units</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          type='number'
          min={1}
          value={units}
          onChange={(e) => {
            setUnits(Number(e.target.value));
            setActiveElement();
          }}
        />
      </InputGroup>
    </Col>
    <Col xs='auto'>
      <Dropdown>
        <Dropdown.Toggle>{linkWeight.name}</Dropdown.Toggle>
        <Dropdown.Menu>
          {linkWeightOptions.map((linkWeightOption) => <Dropdown.Item
            key={linkWeightOption.value}
            onClick={() => setLinkWeight(linkWeightOption)}
          >{linkWeightOption.name}</Dropdown.Item>)}
        </Dropdown.Menu>
      </Dropdown>
    </Col>
  </Row>
</div>;

const mapStateToProps = ({productionChain:{linkWeight, units}}) => {
  return {linkWeight, units};
};

export default connect(mapStateToProps, {setLinkWeight, setUnits, setActiveElement})(ProdChainHeader);
