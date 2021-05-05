import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import {connect} from 'react-redux';
import chroma from 'chroma-js';

import activityColor from './helpers/activityColor.js';
import {setLinkWeight, setRuns, setActiveElement} from './../../store/actions/prodChain.js';

const linkWeightOptions = [{
  value: 'volume',
  name: 'Volume',
},{
  value: 'quantity',
  name: 'Quantity',
}];

const legendItems = ['purchase', 'manufacturing', 'copying', 'invention'];

class ProdChainHeader extends React.Component {
  state = {modalShow: false};

  openModal = () => this.setState({modalShow: true});
  closeModal = () => this.setState({modalShow: false});

  render() {
    const {linkWeight, setLinkWeight, runs, setRuns, setActiveElement} = this.props;
    const {modalShow} = this.state;

    return <div>
      <h3>Production Chain Diagram</h3>
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
          <Modal show={modalShow} onHide={this.closeModal}>
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
              value={runs}
              onChange={(e) => {
                setRuns(Number(e.target.value));
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
  }
}

const mapStateToProps = ({prodChain:{linkWeight, runs}}) => {
  return {linkWeight, runs};
};

export default connect(mapStateToProps, {setLinkWeight, setRuns, setActiveElement})(ProdChainHeader);
