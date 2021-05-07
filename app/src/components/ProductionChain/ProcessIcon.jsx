import React from 'react';
import Figure from 'react-bootstrap/Figure';
import numeral from 'numeral';

import parseTypeImageUrl from './../../tools/parseTypeImageUrl.js';

const ProcessIcon = ({process}) => <Figure style={{textAlign: 'center'}}>
  <Figure.Image
    width='54' height='54'
    src={process.blueprint ? parseTypeImageUrl(process.blueprint.type, 64,
      process.blueprint.bp_type === 'original' ? 'bp'
      : process.blueprint.bp_type === 'copy' ? 'bpc'
      : process.blueprint.bp_type === 'placeholder' ? 'bpc'
      : process.blueprint.bp_type === 'relic' ? 'relic'
      : 'icon'
    ) : 'https://wiki.eveuniversity.org/images/9/9f/Market.png'}
    style={{background: '#000000'}}
    className={process.blueprint && process.blueprint.bp_type === 'placeholder' ? 'border border-warning' : ''}
  /><Figure.Caption>
    {process.blueprint && <span>{numeral(process.batch.runs).format(0,0)} Runs</span>}
  </Figure.Caption>
</Figure>;

export default ProcessIcon;
