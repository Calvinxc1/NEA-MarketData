import React from 'react';

import BlueprintDetails from './BlueprintDetails.jsx';

class BlueprintItemInfo extends React.Component {
  state = {runs: 1}

  updateRuns = (runs) => this.setState({runs});

  render() {
    return <div>
      <BlueprintDetails item_id={this.props.match.params.item_id} runs={this.state.runs} updateRuns={this.updateRuns} />
    </div>;
  }
}

export default BlueprintItemInfo;
