import React from 'react';
import Image from 'react-bootstrap/Image';
import numeral from 'numeral';

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';

const matCalc = (quantity, materialEfficiency, runs=1) => {
  // Based on formula from https://eve-industry.org/export/IndustryFormulas.pdf
  const interim = Math.round(runs * quantity * (100 - materialEfficiency)) / 100;
  const useMats = Math.max(runs, Math.ceil(interim));
  return useMats;
}

const bpComponentTableCols = (by, materialEfficiency, activityType, runs) => {
  switch(by) {
    case 'material':
      return [{
        dataField: 'type',
        text: '',
        sort: true,
        formatter: (type) => <Image src={parseTypeImageUrl(type, 32)} rounded />,
        headerStyle: () => ({width: '48px'}),
      },{
        dataField: 'type.name',
        text: 'Product',
        sort: true,
      },{
        dataField: 'quantity',
        text: 'Quantity',
        sort: true,
        align: 'right',
        headerAlign: 'center',
        formatter: (quantity, row, rowIndex, {materialEfficiency, activityType, runs}) => {
          return numeral(
              activityType === 'manufacturing'
              ? matCalc(quantity, materialEfficiency, runs)
              : quantity
            ).format('0,0')
        },
        formatExtraData: {materialEfficiency, activityType, runs},
      }];

    case 'product':
      return [{
        dataField: 'type',
        text: '',
        sort: true,
        formatter: (type) => <Image src={parseTypeImageUrl(type, 32,
          type.group.category.id === 9 ? 'bpc' : 'icon'
        )} rounded />,
        headerStyle: () => ({width: '48px'}),
      },{
        dataField: 'type.name',
        text: 'Material',
        sort: true,
      },{
        dataField: 'quantity',
        text: 'Quantity',
        sort: true,
        align: 'right',
        headerAlign: 'center',
        formatter: (quantity, row, rowIndex, {runs}) => numeral(quantity * runs).format('0,0'),
        formatExtraData: {materialEfficiency, activityType, runs},
      },{
        dataField: 'probability',
        text: '%',
        sort: true,
        align: 'right',
        headerAlign: 'center',
        formatter: (probability) => numeral(probability).format('0%'),
        headerStyle: () => ({width: '64px'}),
      }];

    case 'skill':
      return [{
        dataField: 'type',
        text: '',
        sort: true,
        formatter: (type) => <Image src={parseTypeImageUrl(type, 32)} rounded />,
        headerStyle: () => ({width: '48px'}),
      },{
        dataField: 'type.name',
        text: 'Skill',
        sort: true,
      },{
        dataField: 'level',
        text: 'Level',
        sort: true,
        align: 'right',
        headerAlign: 'center',
        headerStyle: {width: '64px'},
      }];

    default:
      return [];
  }
}

export default bpComponentTableCols;
