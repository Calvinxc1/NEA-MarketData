import React from 'react';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';
import {Provider} from 'react-redux';

import SankeyRender from './SankeyRender.jsx';
import store from './store.js';

class MatChainSankey extends React.Component {
  state = {output_target: 1};

  render() {
    return <Jumbotron>
      <Row>
        <Col xs='10'><h3>Production Chain Diagram</h3></Col>
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
      </Row>
      <Provider store={store}>
        <SankeyRender
          type_id={this.props.type_id}
          output_target={this.state.output_target}
        />
      </Provider>
    </Jumbotron>;
  }
}

export default MatChainSankey;
