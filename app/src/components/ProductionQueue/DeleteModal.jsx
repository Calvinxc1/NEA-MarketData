import React from 'react';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import {connect} from 'react-redux';
import numeral from 'numeral';

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';
import {setDeleteQueue} from './../../store/actions/productionQueue.js';

const DeleteModal = ({deleteQueue, setDeleteQueue, deleteQueueRecord}) => <div>
  {deleteQueue.id && <Modal show={!!deleteQueue.id} onHide={() => setDeleteQueue()}>
    <Modal.Body>
      <Image
        src={parseTypeImageUrl(deleteQueue.type, 64,
          deleteQueue.type.group.category.id === 9 ? 'bpc'
          : deleteQueue.type.group.category.id === 34 ? 'relic'
          : 'icon'
        )}
        thumbnail
      /> Confirm deletion of <em>{deleteQueue.type.name}</em> - ({numeral(deleteQueue.units).format('0,0')})
    </Modal.Body>
    <Modal.Footer>
      <Button
        variant='danger'
        onClick={() => {
          deleteQueueRecord(deleteQueue.id);
          setDeleteQueue();
        }}
      >Confirm</Button>
      <Button
        variant='cancel'
        onClick={() => setDeleteQueue()}
      >Cancel</Button>
    </Modal.Footer>
  </Modal>}
</div>;

const mapStateToProps = ({productionQueue:{deleteQueue}}) => {
  return {deleteQueue};
};

export default connect(mapStateToProps, {setDeleteQueue})(DeleteModal);
