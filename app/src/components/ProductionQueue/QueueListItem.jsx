import React from 'react';
import {Draggable} from 'react-beautiful-dnd';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrashAlt, faAngleDoubleDown, faBars, faFileExport} from '@fortawesome/free-solid-svg-icons';
import {connect} from 'react-redux';
import numeral from 'numeral';
import moment from 'moment';

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';
import QueueStatus from './QueueStatus.jsx';
import {setDeleteQueue} from './../../store/actions/productionQueue.js';
import buildQuickbar from './helpers/buildQuickbar.js';
import {setQuickbar} from './../../store/actions/productionQueue.js';

const QueueListItem = ({queue, index, setDeleteQueue, setQuickbar}) =>{
  const queueName = `${queue.type.name} (${queue.units})`;

  return <Draggable
    draggableId={queue.id}
    index={index}
  >{(provided, snapshot) => <Card
    {...provided.draggableProps}
    ref={provided.innerRef}
  >
    <Card.Header>
      <Row style={{alignItems: 'center'}}>
        <Col xs='1' style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <div {...provided.dragHandleProps} >
            <FontAwesomeIcon icon={faBars} />
          </div>
          <Accordion.Toggle as={Button} variant='link' size='sm' eventKey={queue.id}>
            <FontAwesomeIcon icon={faAngleDoubleDown} />
          </Accordion.Toggle>
        </Col>
        <Col xs='4'><Image
          src={parseTypeImageUrl(queue.type, 32,
            queue.type.group.category.id === 9 ? 'bpc'
            : queue.type.group.category.id === 34 ? 'relic'
            : 'icon'
          )}
          thumbnail
        /> {queue.type.name}</Col>
        <Col xs='3'>{queue.station.name}</Col>
        <Col xs='1' style={{textAlign: 'right'}}>{numeral(queue.units).format('0,0')}</Col>
        <Col xs='2' style={{textAlign: 'center'}}>{moment(queue.created).format('YYYY-MM-DD HH:mm:ss')}</Col>
        <Col xs='1' style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <Button
            variant='outline-success'
            size='sm'
            onClick={() => setQuickbar(buildQuickbar(queueName, queue.needs))}
          ><FontAwesomeIcon icon={faFileExport} /></Button>
          <Button
            variant='outline-danger'
            size='sm'
            onClick={() => setDeleteQueue(queue)}
          ><FontAwesomeIcon icon={faTrashAlt} /></Button>
        </Col>
      </Row>
    </Card.Header>
    <Accordion.Collapse eventKey={queue.id}>
      <Card.Body>
        <QueueStatus
          queueName={queueName}
          needs={queue.needs}
          used={queue.used}
        />
      </Card.Body>
    </Accordion.Collapse>
  </Card>}</Draggable>;
};

export default connect(null, {setDeleteQueue, setQuickbar})(QueueListItem);
