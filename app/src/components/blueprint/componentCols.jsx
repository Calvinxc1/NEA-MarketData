import React from 'react';
import {useQuery} from 'react-query';
import Image from 'react-bootstrap/Image';
import numeral from 'numeral';

import fetchBlueprintBy from './../../fetchers/fetchBlueprintBy.jsx';
import BlueprintInfoComponentPopover from './BlueprintInfoComponentPopover.jsx';

const matCalc = (quantity, materialEfficiency, runs) => {
  // Based on formula from https://eve-industry.org/export/IndustryFormulas.pdf
  const interim = Math.round(runs * quantity * (100 - materialEfficiency)) / 100;
  const useMats = Math.max(runs, Math.ceil(interim));
  return useMats;
}

const ComponentCell = ({children, type_id, by}) => {
  const {data, status} = useQuery(['fetchBlueprintBy', {by, type_id}], fetchBlueprintBy);

  return <div>{
    status !== 'success' ? <div style={{color: '#666666'}}>{children}</div>
    : status === 'success' && data.data.length === 0 ? children
    : <BlueprintInfoComponentPopover
        blueprints={data.data}
        type_id={type_id}
        by={by}
      ><div style={{textAlign: 'left'}}>{children}</div></BlueprintInfoComponentPopover>
  }</div>;
}

const componentCols = (by, runs, materialEfficiency, activityType) => {
  switch(by) {
    case 'material':
      return [{
        dataField: 'type_id',
        text: '',
        sort: true,
        formatter: (type_id) => <span>
          <Image src={`https://images.evetech.net/types/${type_id}/icon?size=32`} rounded />
        </span>,
        headerStyle: () => ({width: '48px'}),
      },{
        dataField: 'type_name',
        text: 'Material',
        sort: true,
        formatter: (type_name, {type_id}) => <ComponentCell by={by} type_id={type_id}>{type_name}</ComponentCell>,
      },{
        dataField: 'quantity',
        text: 'Quantity',
        sort: true,
        align: 'right',
        headerAlign: 'center',
        formatter: (quantity, row, rowIndex, {materialEfficiency, runs, activityType}) => <span>
          {numeral(
            activityType === 'manufacturing'
            ? matCalc(quantity, materialEfficiency, runs)
            : quantity * runs
          ).format('0,0')}
        </span>,
        formatExtraData: {materialEfficiency, runs, activityType},
      }];

    case 'product':
      return [{
        dataField: 'type_id',
        text: '',
        sort: true,
        formatter: (type_id) => <span>
          <Image src={`https://images.evetech.net/types/${type_id}/icon?size=32`} rounded />
        </span>,
        headerStyle: () => ({width: '48px'}),
      },{
        dataField: 'type_name',
        text: 'Product',
        sort: true,
        formatter: (type_name, {type_id}) => <ComponentCell by={by} type_id={type_id}>{type_name}</ComponentCell>,
      },{
        dataField: 'quantity',
        text: 'Quantity',
        sort: true,
        align: 'right',
        headerAlign: 'center',
        formatter: (quantity, row, rowIndex, {runs}) => <span>
          {numeral(quantity * runs).format('0,0')}
        </span>,
        formatExtraData: {runs},
      },{
        dataField: 'probability',
        text: '%',
        sort: true,
        align: 'right',
        headerAlign: 'center',
        formatter: (probability) => <span>
          {numeral(probability).format('0%')}
        </span>,
        headerStyle: () => ({width: '64px'}),
      }];
    default:
      return [];
  }
}

export default componentCols;
