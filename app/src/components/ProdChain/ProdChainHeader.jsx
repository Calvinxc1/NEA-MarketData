import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import {useQuery} from 'react-query';
import chroma from 'chroma-js';

import activityColor from './activityColor.js';
import fetchBlueprintLocation from './../../fetchers/fetchBlueprintLocation.js';
import Loading from './../Loading/Loading.jsx';

const scalePathOptions = [{
  value: 'units',
  name: 'Quantity',
},{
  value: 'mat_vol',
  name: 'Volume',
}];

const legendItems = ['purchase', 'manufacturing', 'copying', 'invention'];

const queryWrapper = (Component) => (props) => {
  const {data, status} = useQuery(['fetchBlueprintLocation'], fetchBlueprintLocation);
  return status === 'success' ? <Component {...props} data={data.data} /> : <Loading />;
};

class ProdChainHeader extends React.Component {
  state = {modalShow: false};

  openModal = () => this.setState({modalShow: true});
  closeModal = () => this.setState({modalShow: false});

  render() {
    return <div>
      <Row>
        <Col xs={6}><h3>Production Chain Diagram</h3></Col>
        <Col xs='auto'>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Station</InputGroup.Text>
            </InputGroup.Prepend>
            <Dropdown style={{border: '1px solid #000000'}}>
              <Dropdown.Toggle variant='secondary'>{this.props.station.name}</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  key={-1}
                  onClick={() => {
                    this.props.updateBlueprintItems(null);
                    this.props.updateStation({id: null, name: 'No Station Selected'});
                  }}
                >No Station Selected</Dropdown.Item>
                {this.props.data.map((location) => <Dropdown.Item
                  key={location.station_id}
                  onClick={() => {
                    this.props.updateBlueprintItems(null);
                    this.props.updateStation({id: location.station_id, name: location.name});
                  }}
                >{location.name}</Dropdown.Item>)}
              </Dropdown.Menu>
            </Dropdown>
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col xs='4'>
          {legendItems.map((legendItem) => <span key={legendItem}><span
            style={{color: chroma(activityColor(legendItem)).darken(0.5).hex()}}
          >{legendItem.split('_').map((word) => word[0].toUpperCase() + word.substr(1)).join(' ')}</span> | </span>)}
        </Col>
        <Col xs='4'>
          <Button
            variant='primary'
            style={{width: '100%'}}
            onClick={this.openModal}
          >Save to Queue</Button>
          <Modal show={this.state.modalShow} onHide={this.closeModal}>
            <Modal.Header>
              <Modal.Title>Add to Production Queue</Modal.Title>
            </Modal.Header>
            <Modal.Body>

            </Modal.Body>
            <Modal.Footer>
              <Button variant='secondary'>Save</Button>
              <Button variant='danger' onClick={this.closeModal}>Cancel</Button>
            </Modal.Footer>
          </Modal>
        </Col>
        <Col xs='2'>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Runs</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              type='number'
              min={1}
              value={this.props.outputUnits}
              onChange={(e) => this.props.updateOutputUnits(Number(e.target.value))}
            />
          </InputGroup>
        </Col>
        <Col xs='auto'>
          <Dropdown>
            <Dropdown.Toggle>{this.props.scalePath.name}</Dropdown.Toggle>
            <Dropdown.Menu>
              {scalePathOptions.map((pathOption) => <Dropdown.Item
                key={pathOption.value}
                onClick={() => this.props.updateScalePath(pathOption)}
              >{pathOption.name}</Dropdown.Item>)}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </div>;
  }
}

export default queryWrapper(ProdChainHeader);
