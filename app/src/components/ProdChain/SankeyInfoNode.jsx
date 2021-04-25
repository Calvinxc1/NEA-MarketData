import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {connect} from 'react-redux';
import numeral from 'numeral';

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';
import storeMapper from './storeMapper.js';

const columns = [{
  dataField: 'item_id',
  text: '',
  align: 'center',
  formatter: (item_id, row) => <Image
    src={parseTypeImageUrl(row, 32, row.bp_type === 'copy' ? 'bpc' : 'bp')}
    thumbnail
  />,
  headerStyle: {width: '64px'},
},{
  dataField: 'parent_station.name',
  text: 'Location',
},{
  dataField: '',
  text: 'ME/TE',
  formatter: (cell, {material_efficiency, time_efficiency}) => <span>
    {material_efficiency}/{time_efficiency}
  </span>,
  headerStyle: {width: '64px'},
},{
  dataField: 'runs',
  text: 'Runs',
  formatter: (runs) => <span>{runs === -1 ? 'N/A' : runs}</span>,
  headerStyle: {width: '64px'},
}]

class SankeyInfoNode extends React.Component {
  state = {
    bpItemModalShow: false,
  };

  addBpItem = (e, blueprint) => {
    if(!this.props.bp_item_ids.includes(blueprint.item_id)) {
      this.props.addBpItemId(blueprint.item_id);
    }
    this.closeBpItemModal();
  };

  removeBpItem = (blueprint) => {
    if(this.props.bp_item_ids.includes(blueprint.item_id)) {
      this.props.removeBpItemId(blueprint.item_id);
    }
    this.closeBpItemModal();
  }

  openBpItemModal = () => {
    this.props.dispatch({type: 'HIDE_LABELS'});
    this.setState({bpItemModalShow: true});
  };

  closeBpItemModal = () => {
    this.props.dispatch({type: 'SHOW_LABELS'});
    this.setState({bpItemModalShow: false});
  };

  renderBpItemTable = (blueprint) => <Modal
    show={this.state.bpItemModalShow}
    onHide={this.closeBpItemModal}
  >
    <Modal.Header>
      <Modal.Title>Blueprints available for use</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <BootstrapTable
        columns={columns}
        data={this.props.blueprints}
        //defaultSorted={defaultSorted}
        keyField="item_id"
        bootstrap4
        hover
        pagination={paginationFactory()}
        rowEvents={{onClick: this.addBpItem}}
      />
    </Modal.Body>
    <Modal.Footer>
      {blueprint && <Button
        variant='warning'
        onClick={() => this.removeBpItem(blueprint)}
      >Clear Blueprint</Button>}
    </Modal.Footer>
  </Modal>;

  renderBpItem = () => {
    let blueprint
    this.props.blueprints.forEach((bpItem) => {
      if(this.props.bp_item_ids.includes(bpItem.item_id)) {
        blueprint = bpItem;
      }
    });

    return <div>
      <Button onClick={this.openBpItemModal}>
        {blueprint ? <div>
          <Image
            src={parseTypeImageUrl(blueprint, 32, blueprint.bp_type === 'copy' ? 'bpc' : 'bp')}
            thumbnail
          /> {blueprint.parent_station.name} (
            {blueprint.material_efficiency}/{blueprint.time_efficiency}
          )
        </div> : 'No Blueprint Specified (0/0)'}
      </Button>
      {this.renderBpItemTable(blueprint)}
    </div>;
  };

  render() {
    return <Alert variant='info' style={{backgroundColor: '#204060'}}>
      <h3>{this.props.node.blueprint.type_name}</h3>
      {this.props.blueprints && this.renderBpItem()}
      <hr />
      <Row>
        <Col xs='6'>
          <p>
            <b><u>Activity Type</u></b>: {this.props.node.activity_type.split('_').map((word) => word[0].toUpperCase() + word.substr(1)).join(' ')}
          </p>
          <p>
            <b><u>Runs</u></b>: {numeral(this.props.node.needed_runs).format('0,0.00')}
          </p>
        </Col>
        <Col>
          <p>
            <b><u>Output</u></b>: <Image
              thumbnail
              src={parseTypeImageUrl(this.props.node.product, 32, 'bpc')}
              style={{background: '#000000'}}
            /> {this.props.node.product.type_name}
          </p>
          <p>
            <b><u>Output Units</u></b>: {numeral(this.props.node.needed_units).format('0,0.00')}
          </p>
        </Col>
      </Row>
      <Row>
        <Col xs='6'>
          <p style={{textAlign: 'center'}}><b><u>Input Material(s)</u></b></p>
          <ListGroup>
            {this.props.node.targetLinks.map((link) => <ListGroup.Item style={{background: '#2171b5'}} key={link.link_id}>
              <Image
                thumbnail
                src={parseTypeImageUrl(link.material, 32, 'bpc')}
                style={{background: '#000000'}}
              /> {link.material.type_name} ({numeral(link.mat_quant).format('0,0.00')})
            </ListGroup.Item>)}
          </ListGroup>
        </Col>
        <Col xs='6'>
          <p style={{textAlign: 'center'}}><b><u>Output Process(es)</u></b></p>
          <ListGroup>
            {this.props.node.sourceLinks.map((link) => <ListGroup.Item style={{background: '#2171b5'}} key={link.link_id}>
              <Image
                thumbnail
                src={parseTypeImageUrl(link.target.blueprint, 32, 'bpc')}
                style={{background: '#000000'}}
              /> {link.target.blueprint.type_name} (
                {numeral(link.mat_quant).format('0,0.00')}, {numeral(link.mat_quant/this.props.node.needed_units).format('0.0%')}
              )
            </ListGroup.Item>)}
          </ListGroup>
        </Col>
      </Row>
    </Alert>;
  }
}

export default connect(storeMapper)(SankeyInfoNode);
