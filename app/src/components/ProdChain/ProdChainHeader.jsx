import React from 'react';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import {useQuery} from 'react-query';
import chroma from 'chroma-js';

import activityColor from './activityColor.js';
import fetchBlueprintLocation from './../../fetchers/fetchBlueprintLocation.js';

const scalePathOptions = [{
  value: 'units',
  name: 'Quantity',
},{
  value: 'mat_vol',
  name: 'Volume',
}];

const legendItems = ['purchase', 'manufacturing', 'copying', 'invention'];

const ProdChainHeader = ({outputUnits, updateOutputUnits, scalePath, updateScalePath, station, updateStation}) => {
  const {data, status} = useQuery(['fetchBlueprintLocation'], fetchBlueprintLocation);

  return <div>
    <Row>
      <Col xs={6}><h3>Production Chain Diagram</h3></Col>
      <Col xs={6}>
        {status === 'success' && <Dropdown>
          <Dropdown.Toggle variant='secondary'>{station.name}</Dropdown.Toggle>
          <Dropdown.Menu>
            {data.data.locations.map((location) => <Dropdown.Item
              key={location.station_id}
              onClick={() => updateStation({id: location.station_id, name: location.name})}
            >{location.name}</Dropdown.Item>)}
          </Dropdown.Menu>
        </Dropdown>}
      </Col>
    </Row>
    <Row>
      <Col xs='4'>
        {legendItems.map((legendItem) => <span key={legendItem}><span
          style={{color: chroma(activityColor(legendItem)).darken(0.5).hex()}}
        >{legendItem.split('_').map((word) => word[0].toUpperCase() + word.substr(1)).join(' ')}</span> | </span>)}
      </Col>
      <Col xs='4'>

      </Col>
      <Col xs='2'>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>Runs</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            type='number'
            min={1}
            value={outputUnits}
            onChange={(e) => updateOutputUnits(Number(e.target.value))}
          />
        </InputGroup>
      </Col>
      <Col xs='auto'>
        <Dropdown>
          <Dropdown.Toggle>{scalePath.name}</Dropdown.Toggle>
          <Dropdown.Menu>
            {scalePathOptions.map((pathOption) => <Dropdown.Item
              key={pathOption.value}
              onClick={() => updateScalePath(pathOption)}
            >{pathOption.name}</Dropdown.Item>)}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  </div>;
};

export default ProdChainHeader;
