import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

import deleteProductionQueue from './../../api/deleteProductionQueue.js';

class QueueListHeader extends React.Component {
  state = {modalShow: false};

  deleteRecords = () => {
    const {queue_ids, refetch, updateSelected} = this.props;

    deleteProductionQueue({queue_ids})
      .then(() => {
        queue_ids.forEach((id) => updateSelected(id, false));
        refetch();
        this.closeModal();
      })
      .catch((err) => console.log(err));
  };

  openModal = () => this.setState({modalShow: true});
  closeModal = () => this.setState({modalShow: false});

  render() {
    const {queue_ids} = this.props;
    const {modalShow} = this.state;

    return <Row>
      <Col><h3>Production Queue</h3></Col>
      <Col xs='auto'>
        {queue_ids.length > 0 && <Button
          variant='outline-danger'
          onClick={this.openModal}
        >Delete</Button>}
        <Modal show={modalShow} onHide={this.closeModal}>
          <Modal.Header>
            <Modal.Title>Add to Production Queue</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Confirm deletion of {queue_ids.length} records.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant='danger'
              onClick={this.deleteRecords}
            >Confirm</Button>
            <Button
              variant='cancel'
              onClick={this.closeModal}
            >Cancel</Button>
          </Modal.Footer>
        </Modal>
      </Col>
    </Row>;
  }
}

export default QueueListHeader;
