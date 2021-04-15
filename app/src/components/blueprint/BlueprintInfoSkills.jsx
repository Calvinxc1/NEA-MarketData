import React from 'react';
import Image from 'react-bootstrap/Image';
import BootstrapTable from 'react-bootstrap-table-next';

const columns = [{
  dataField: 'type_id',
  text: '',
  sort: true,
  formatter: (val) => <span>
    <Image src={`https://images.evetech.net/types/${val}/icon?size=32`} rounded />
  </span>,
  headerStyle: () => ({width: '48px'}),
},{
  dataField: 'type_name',
  text: 'Skill',
  sort: true,
},{
  dataField: 'level',
  text: 'Level',
  sort: true,
  align: 'right',
  headerAlign: 'center',
  headerStyle: () => ({width: '64px'}),
}];

const BlueprintInfoSkills = ({skills}) => <div>
  <BootstrapTable
    bootstrap4
    bordered={false}
    caption={<h5 style={{textAlign: 'center'}}>Activity Skill Requirement</h5>}
    columns={columns}
    condensed
    data={skills}
    hover
    keyField='type_id'
    noDataIndication='No Skill Requirement'
  />
</div>;

export default BlueprintInfoSkills;
