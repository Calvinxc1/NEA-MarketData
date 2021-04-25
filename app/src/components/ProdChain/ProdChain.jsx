import React from 'react';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';
import {Provider} from 'react-redux';

import SankeyRender from './SankeyRender.jsx';
import store from './store.js';

class ProdChain extends React.Component {
  state = {
    output_target: 1,
    scalePath: {
      value: 'mat_vol',
      name: 'Volume',
    },
    bp_item_ids: [],
  };

  scalePathOptions = [{
    value: 'mat_quant',
    name: 'Quantity',
  },{
    value: 'mat_vol',
    name: 'Volume',
  }];

  addBpItemId = (itemId) => {
    this.setState((priorState) => {
      const bp_item_ids = [...priorState.bp_item_ids, itemId];
      return {bp_item_ids};
    });
  };

  removeBpItemId = (itemId) => {
    this.setState((priorState) => {
      const itemIdx = priorState.bp_item_ids.indexOf(itemId);
      const bp_item_ids = [
        ...priorState.bp_item_ids.slice(0,itemIdx),
        ...priorState.bp_item_ids.slice(itemIdx+1),
      ];
      return {bp_item_ids};
    });
  }

  render() {
    return <Jumbotron>
      <h3>Production Chain Diagram</h3>
      <Row>
        <Col xs='8'>

        </Col>
        <Col xs='2'>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Runs</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              type='number'
              min={1}
              value={this.state.output_target}
              onChange={(e) => this.setState({output_target: Number(e.target.value)})}
            />
          </InputGroup>
        </Col>
        <Col xs='auto'>
          <Dropdown>
            <Dropdown.Toggle>{this.state.scalePath.name}</Dropdown.Toggle>
            <Dropdown.Menu>
              {this.scalePathOptions.map((pathOption) => <Dropdown.Item
                key={pathOption.value}
                onClick={() => this.setState({scalePath: pathOption})}
              >{pathOption.name}</Dropdown.Item>)}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Provider store={store}>
        <SankeyRender
          type_id={this.props.type_id}
          output_target={this.state.output_target}
          bp_item_ids={this.state.bp_item_ids}
          scalePath={this.state.scalePath.value}
          addBpItemId={this.addBpItemId}
          removeBpItemId={this.removeBpItemId}
        />
      </Provider>
    </Jumbotron>;
  }
}

export default ProdChain;
