import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {sankey} from 'd3-sankey';

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';
import postProductionQueue from './../../api/postProductionQueue.js';

class ModalSaveQueue extends React.Component {
  state = {
    modalShow: false,
    saving: false,
  };

  openModal = () => this.setState({modalShow: true});
  closeModal = () => this.setState({modalShow: false});

  submitQueueRecord = () => {
    this.setState({saving: true});
    const queueRecord = this.buildQueueRecord();
    postProductionQueue(queueRecord)
      .then((resp) => this.props.history.push('/production/queue'))
      .catch((err) => console.log(err));
  }

  buildQueueRecord = () => {
    const {data, selectedStation:station, units} = this.props;
    const {nodes} = sankey().nodeId((d) => d.node_id)(data);

    const queueRecord = {
      path: this.decomposeQueuePath(nodes[0], units),
      station,
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
    const {modalShow, saving} = this.state;

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
          {selectedStation && <Button
            variant='secondary'
            onClick={this.submitQueueRecord}
            disabled={saving}
          >Save</Button>}
          <Button
            variant='danger'
            onClick={this.closeModal}
            disabled={saving}
          >Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>;
  }
}

const mapStateToProps = ({globalState:{selectedStation}, productionChain:{units}}) => {
  return {selectedStation, units};
};

export default connect(mapStateToProps)(withRouter(ModalSaveQueue));
