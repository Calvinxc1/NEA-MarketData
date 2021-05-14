import React from 'react';
import FormControl from 'react-bootstrap/FormControl';
import Modal from 'react-bootstrap/Modal'
import {connect} from 'react-redux';

import {setQuickbar} from './../../store/actions/productionQueue.js';

const QuickbarModal = ({quickbar, setQuickbar}) => <Modal show={quickbar.length > 0} onHide={() => setQuickbar()}>
  <Modal.Header closeButton>
    <Modal.Title>Quickbar String</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <FormControl
      as='textarea'
      value={quickbar.join('\n')}
      rows={quickbar.length}
    />
  </Modal.Body>
</Modal>;

const mapStateToProps = ({productionQueue:{quickbar}}) => {
  return {quickbar};
};

export default connect(mapStateToProps, {setQuickbar})(QuickbarModal);
