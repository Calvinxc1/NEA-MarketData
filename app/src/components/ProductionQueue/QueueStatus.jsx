import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Jumbotron from 'react-bootstrap/Jumbotron';

import QueueNeeds from './QueueNeeds.jsx';
import QueueUsed from './QueueUsed.jsx';

const QueueStatus = ({queueName, needs, used}) => <Jumbotron>
  <Accordion defaultActiveKey='needs'>
    <Card>
      <Accordion.Toggle as={Card.Header} eventKey='needs'>
        <h3>Needed Components</h3>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey='needs'>
        <QueueNeeds queueName={queueName} needs={needs} />
      </Accordion.Collapse>
    </Card>
    <Card>
      <Accordion.Toggle as={Card.Header} eventKey='used'>
        <h3>Used Components</h3>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey='used'>
        <QueueUsed queueName={queueName} used={used} />
      </Accordion.Collapse>
    </Card>
  </Accordion>
</Jumbotron>;

export default QueueStatus;
