import React, {useContext} from 'react';
import AccordionContext from 'react-bootstrap/AccordionContext';
import {useAccordionToggle} from 'react-bootstrap/AccordionToggle';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

const padZero = (value) => value >= 10 ? `${value}` : `0${value}`;

const parseProdTime = (prodTime, timeEfficiency, runs) => {
  // Based on formula from https://eve-industry.org/export/IndustryFormulas.pdf
  const timeModifier = (100 - timeEfficiency) / 100;
  const adjTime = prodTime * timeModifier * runs;
  const timeMoment = moment.duration(adjTime, 'seconds');
  let duration = `${padZero(timeMoment.hours())}:${padZero(timeMoment.minutes())}:${padZero(timeMoment.seconds())}`;
  if(timeMoment.days() > 0) {
    duration = `${timeMoment.days() % 7}D ${duration}`;
  }
  if(timeMoment.days() >= 7) {
    duration = `${Math.floor(timeMoment.days() / 7)}W ${duration}`;
  }
  return duration;
}

const BlueprintActivityToggle = ({children, eventKey, callback, runVal, maxProdLimit, updateRuns, prodTime, timeEfficiency}) => {
  const currentEventKey = useContext(AccordionContext);
  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey),
  );
  const isCurrentEventKey = currentEventKey === eventKey;

  let maxVal
  switch(eventKey) {
    case 'research_material':
      maxVal = 10;
      break;
    case 'research_time':
      maxVal = 10;
      break;
    default:
      maxVal = maxProdLimit;
  }

  return <Row>
    <Col xs='4'>
      <Button variant='outline-light' onClick={decoratedOnClick}>
        {isCurrentEventKey ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}
        {children}
      </Button>
    </Col>
    <Col xs='6'>
      {isCurrentEventKey && <div>
        {eventKey === 'manufacturing' && <div>Manufacturing Duration: {parseProdTime(prodTime, timeEfficiency, runVal)}</div>}
      </div>}
    </Col>
    <Col xs='2'>
      {isCurrentEventKey && <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>Runs</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          type='number'
          min={1}
          max={maxVal}
          value={runVal}
          onChange={(e) => updateRuns(eventKey, Number(e.target.value))}
        />
      </InputGroup>}
    </Col>
  </Row>;
}

export default BlueprintActivityToggle;
