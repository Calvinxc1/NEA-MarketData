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
      name: 'No Station Selected',
    },
    bp_items: null,
  };

  updateOutputUnits = (output_units) => this.setState({output_units});

  updateScalePath = (scalePath) => this.setState({scalePath});

  updateStation = (station) => this.setState({station});

  updateBlueprintItems = (bp_items) => this.setState({bp_items});

  render() {
    return <Jumbotron>
      <ProdChainHeader
        outputUnits={this.state.output_units}
        updateOutputUnits={this.updateOutputUnits}
        scalePath={this.state.scalePath}
        updateScalePath={this.updateScalePath}
        station={this.state.station}
        updateBlueprintItems={this.updateBlueprintItems}
        updateStation={this.updateStation}
      />
      <Provider store={store}>
        <SankeyRender
          type_id={this.props.match.params.type_id}
          output_units={this.state.output_units}
          station_ids={this.state.station.id ? [this.state.station.id] : []}
          bp_items={this.state.bp_items}
          scalePath={this.state.scalePath.value}
          updateBlueprintItems={this.updateBlueprintItems}
        />
      </Provider>
    </Jumbotron>;
  }
}

export default ProdChain;
