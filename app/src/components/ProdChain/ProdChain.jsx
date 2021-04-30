import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import {Provider} from 'react-redux';

import SankeyRender from './SankeyRender.jsx';
import ProdChainHeader from './ProdChainHeader.jsx';
import store from './store.js';

class ProdChain extends React.Component {
  state = {
    output_units: 1,
    scalePath: {
      value: 'units',
      name: 'Quantity',
    },
    station: {
      id: null,
      name: 'Please choose a station'
    },
  };

  updateOutputUnits = (output_units) => this.setState({output_units});

  updateScalePath = (scalePath) => this.setState({scalePath});

  updateStation = (station) => this.setState({station});

  render() {
    return <Jumbotron>
      <ProdChainHeader
        outputUnits={this.state.output_units}
        updateOutputUnits={this.updateOutputUnits}
        scalePath={this.state.scalePath}
        updateScalePath={this.updateScalePath}
        station={this.state.station}
        updateStation={this.updateStation}
      />
      <Provider store={store}>
        <SankeyRender
          type_id={this.props.match.params.type_id}
          output_units={this.state.output_units}
          station_ids={this.state.station.id ? [this.state.station.id] : []}
          scalePath={this.state.scalePath.value}
        />
      </Provider>
    </Jumbotron>;
  }
}

export default ProdChain;
