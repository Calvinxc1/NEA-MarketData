import React from 'react';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import {connect} from 'react-redux';

import {setSearch, setType} from './../../store/actions/blueprintExplorer.js';

const typeOptions =[{
  value: '',
  label: 'All',
},{
  value: 'bp',
  label: 'Original',
},{
  value: 'bpc',
  label: 'Copy',
},{
  value: 'relic',
  label: 'Relic',
}]

const BlueprintExplorerFilters = ({search, setSearch, type, setType}) => <Row>
  <Col xs={6}>
    <InputGroup>
      <InputGroup.Prepend>
        <InputGroup.Text>Search</InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl
        as='input'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </InputGroup>
  </Col>
  <Col xs={3}>
    <InputGroup>
      <InputGroup.Prepend>
        <InputGroup.Text>Type</InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl
        as='select'
        value={type}
        onChange={(e) => setType(e.target.value)}
      >{typeOptions.map(({value, label}) => <option
        value={value}
        key={value}
      >{label}</option>)}
      </FormControl>
    </InputGroup>
  </Col>
</Row>;

const mapStateToProps = ({blueprintExplorer:{search, type}}) => {
  return {search, type};
};

export default connect(mapStateToProps, {setSearch, setType})(BlueprintExplorerFilters);
