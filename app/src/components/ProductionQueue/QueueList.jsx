import React from 'react';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import Accordion from 'react-bootstrap/Accordion';
import Col from 'react-bootstrap/Col';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';

import putProductionQueuePriority from './../../api/putProductionQueuePriority.js';
import QueueListItem from './QueueListItem.jsx';

class QueueList extends React.Component {
  onDragEnd = ({draggableId:queue_id, source:{index:source}, destination:{index:destination}}) => {
    const {queues, refetch} = this.props;

    queues.splice(destination, 0, queues.splice(source, 1)[0]);
    const priorities = queues.map((queue) => queue.id);
    putProductionQueuePriority(priorities)
      .then((resp) => refetch())
      .catch((err) => console.log(err));
  };

  render() {
    const {queues} = this.props;

    return <Jumbotron>
      <h3>Production Queue ({queues.length})</h3>
      <Row>
        <Col xs='1'></Col>
        <Col xs='4' style={{textAlign: 'center'}}><h4>Type Name</h4></Col>
        <Col xs='3' style={{textAlign: 'center'}}><h4>Station</h4></Col>
        <Col xs='1' style={{textAlign: 'center'}}><h4>Units</h4></Col>
        <Col xs='2' style={{textAlign: 'center'}}><h4>Created At</h4></Col>
        <Col xs='1'></Col>
      </Row>
      <Accordion>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId='queueList'>
            {(provided) => <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {queues.map((queue, index) => <QueueListItem
                key={queue.id}
                queue={queue}
                index={index}
              />)}
              {provided.placeholder}
            </div>}
          </Droppable>
        </DragDropContext>
      </Accordion>
    </Jumbotron>;
  }
}

export default QueueList;
