import React from 'react';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';

const typeOptions =[{
  value: '',
  label: 'All',
},{
  value: 'original',
  label: 'Original',
},{
  value: 'copy',
  label: 'Copy',
},{
  value: 'relic',
  label: 'Relic',
}]

const BlueprintSearchBar = ({hookSearch, search, hookType, type}) => <Row>
  <Col xs={6}>
    <InputGroup>
      <InputGroup.Prepend>
        <InputGroup.Text>Search</InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl
        as='input'
        value={search}
        onChange={hookSearch}
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
        onChange={hookType}
      >
        {typeOptions.map(({value, label}) => <option value={value} key={value}>
          {label}
        </option>)}
      </FormControl>
    </InputGroup>
  </Col>
</Row>;

export default BlueprintSearchBar;
