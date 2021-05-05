import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import {connect} from 'react-redux';
import {sankey} from 'd3-sankey';

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';
import postProductionQueue from './../../api/postProductionQueue.js';

class ModalSaveQueue extends React.Component {
  state = {modalShow: false};

  openModal = () => this.setState({modalShow: true});
  closeModal = () => this.setState({modalShow: false});

  submitQueueRecord = () => {
    const queueRecord = this.buildQueueRecord();
    //const resp = postProductionQueue(queueRecord);
    console.log(queueRecord);
    this.closeModal();
  }

  buildQueueRecord = () => {
    const {data, selectedStation, units} = this.props;
    const {nodes} = sankey().nodeId((d) => d.node_id)(data);

    const queueRecord = {
      path: this.decomposeQueuePath(nodes[0], units),
      selectedStation,
    };

    return queueRecord;
  };

  decomposeQueuePath = (node, units) => {
    const {process, type, targetLinks} = node;
    const decomposition = {
      units, process, type,
      components: targetLinks.map(({source, quantity}) => this.decomposeQueuePath(source, quantity)),
    };
    return decomposition;
  }

  render() {
    const {data:{nodes:[node]}, selectedStation} = this.props;
    const {modalShow} = this.state;

    return <div>
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
          <Row>
            <Col xs='2'><Image
              rounded
              src={parseTypeImageUrl(node.type, 64,
                node.type.group.category.id === 9 ? 'bpc'
                : node.type.group.category.id === 34 ? 'relic'
                : 'icon'
              )}
              style={{background: '#000000'}}
            /></Col>
            <Col>
              <p>{node.type.name}: {node.output_units} Units</p>
              {selectedStation ? <p>{selectedStation.name}</p> : <p style={{color: '#e34a33'}}>No Station Designated</p>}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {selectedStation && <Button variant='secondary' onClick={this.submitQueueRecord}>Save</Button>}
          <Button variant='danger' onClick={this.closeModal}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>;
  }
}

const mapStateToProps = ({globalState:{selectedStation}, prodChain:{units}}) => {
  return {selectedStation, units};
};

export default connect(mapStateToProps)(ModalSaveQueue);
