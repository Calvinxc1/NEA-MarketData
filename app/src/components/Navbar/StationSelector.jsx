import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';
import {useQuery} from 'react-query';
import {connect} from 'react-redux';

import getStations from './../../api/getStations.js';
import {updateStation} from './../../store/actions/globalState.js';
import {setActiveElement} from './../../store/actions/productionChain.js';

const queryWrapper = (Component) => (props) => {
  const {data, status} = useQuery(['getStations'], getStations);
  return <Component
    {...props}
    data={status === 'success' ? data.data : null}
    status={status}
  />;
};

const StationSelector = ({data, status, selectedStation, updateStation, setActiveElement}) => <InputGroup style={{display: 'flex', justifyContent: 'flex-end'}}>
  <InputGroup.Prepend>
    <InputGroup.Text>Station</InputGroup.Text>
  </InputGroup.Prepend>
  <Dropdown style={{border: '1px solid #000000'}}>
    {status === 'success' ? <div>
      <Dropdown.Toggle variant='secondary'>{selectedStation ? selectedStation.name : 'No Station Selected'}</Dropdown.Toggle>
      <Dropdown.Menu align='right'>
        <Dropdown.Item
          key={-1}
          onClick={() => {
            updateStation();
            setActiveElement();
          }}
        >None</Dropdown.Item>
        {data.map((station) => <Dropdown.Item
          key={station.station_id}
          onClick={() => {
            updateStation(station);
            setActiveElement();
          }}
        >{station.name}</Dropdown.Item>)}
      </Dropdown.Menu>
    </div>
    : <Spinner animation="border" variant="light" />}
  </Dropdown>
</InputGroup>;

const mapStateToProps = ({globalState:{selectedStation}}) => {
  return {selectedStation};
};

export default connect(mapStateToProps, {updateStation, setActiveElement})(queryWrapper(StationSelector));
