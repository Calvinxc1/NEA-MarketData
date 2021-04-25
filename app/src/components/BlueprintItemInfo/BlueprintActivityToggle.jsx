import React, {useContext} from 'react';
import AccordionContext from 'react-bootstrap/AccordionContext';
import {useAccordionToggle} from 'react-bootstrap/AccordionToggle';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

const BlueprintActivityToggle = ({children, eventKey, callback, activity, activityCount}) => {
  const currentEventKey = useContext(AccordionContext);
  const decoratedOnClick = useAccordionToggle(eventKey, () => callback && callback(eventKey));
  const isCurrentEventKey = currentEventKey === eventKey;

  return <Col
    key={activity.activity_type}
    align='center'
    width={`${100/activityCount}%`}
  >
    <Button
      variant='outline-light'
      onClick={decoratedOnClick}
      style={{
        borderColor: isCurrentEventKey ? '#FFFFFF' : '#999999',
        color: isCurrentEventKey ? '#FFFFFF' : '#999999',
      }}
    >
      {activity.activity_type.split('_').map((word) => word[0].toUpperCase() + word.substr(1)).join(' ')}
    </Button>
  </Col>;
}

export default BlueprintActivityToggle;
