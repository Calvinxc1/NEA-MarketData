import React from 'react';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {Link} from 'react-router-dom';

import buildBpUrl from './../../tools/buildBpUrl.jsx';

const columns = {
  bpType: [{
    dataField: 'type_id',
    text: '',
    align: 'center',
    formatter: (type_id) => <span>
      <Image src={`${buildBpUrl(type_id, 'original')}?size=32`} rounded />
    </span>,
    headerStyle: () => ({width: '48px'}),
  },{
    dataField: 'type_name',
    text: 'Blueprint Type',
    sort: true,
  }],

  bpItem: [{
    dataField: 'bp_type',
    text: '',
    align: 'center',
    formatter: (bp_type, {item_id, type_id}) => <Link to={`/blueprint/${item_id}`}>
      <Image src={`${buildBpUrl(type_id, bp_type)}?size=32`} thumbnail />
    </Link>,
    headerStyle: () => ({width: '48px'}),
  },{
    dataField: 'parent_station.name',
    text: 'Station',
  },{
    dataField: 'material_efficiency',
    text: 'ME',
    align: 'right',
    headerAlign: 'right',
    headerStyle: () => ({width: '32px'}),
  },{
    dataField: 'time_efficiency',
    text: 'TE',
    align: 'right',
    headerAlign: 'right',
    headerStyle: () => ({width: '32px'}),
  },{
    dataField: 'runs',
    text: 'Runs',
    align: 'right',
    headerAlign: 'center',
    formatter: (val) => <span>
      {val < 1 ? 'N/A' : val}
    </span>,
    headerStyle: () => ({width: '48px'}),
  }],
};

const BlueprintInfoComponentPopover = ({children, blueprints, type_id, by}) => <OverlayTrigger
  trigger='click'
  placement='bottom'
  rootClose
  overlay={
    <Popover id={type_id} style={{maxWidth: '512px'}}>
      <Popover.Content>
        <BootstrapTable
          bootstrap4
          bordered={false}
          caption={<h5 style={{textAlign: 'center'}}>{
            by === 'product' ? 'Blueprints w/ Product of Material'
            : by === 'material' ? 'Blueprints w/ Material of Product'
            : null
          }</h5>}
          columns={columns.bpType}
          condensed
          data={blueprints}
          hover
          defaultSorted={[{
            dataField: 'type_name',
            order: 'asc',
          }]}
          keyField='type_id'
          pagination={paginationFactory()}
          expandRow={{
            onlyOneExpanding: true,
            renderer: (row) => <div>
              <BootstrapTable
                bootstrap4
                bordered={false}
                columns={columns.bpItem}
                condensed
                data={row.items}
                hover
                defaultSorted={[{
                  dataField: 'bp_type',
                  order: 'desc',
                }]}
                keyField='item_id'
                pagination={paginationFactory()}
              />
            </div>
          }}
        />
      </Popover.Content>
    </Popover>
  }
>
  <Button variant='link' size='sm'>{children}</Button>
</OverlayTrigger>;

export default BlueprintInfoComponentPopover;
