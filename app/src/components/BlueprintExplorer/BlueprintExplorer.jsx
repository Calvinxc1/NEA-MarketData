import React from 'react';

import BlueprintSearchBar from './BlueprintSearchBar.jsx';
import StationTable from './StationTable.jsx';

class BlueprintExplorer extends React.Component {
  state = {
    search: '',
    type: '',
  };

  hookSearch = (e) => this.setState({search: e.target.value});

  hookType = (e) => this.setState({type: e.target.value});

  render() {
    return <div>
      <h1>Blueprint Explorer</h1>
      <BlueprintSearchBar
        hookSearch={this.hookSearch}
        search={this.state.search}
        hookType={this.hookType}
        type={this.state.type}
      />
      <hr />
      <StationTable search={this.state.search} type={this.state.type} />
    </div>;
  }
}

export default BlueprintExplorer;
