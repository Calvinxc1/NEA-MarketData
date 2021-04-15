import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

import BlueprintInfoHeader from './BlueprintInfoHeader.jsx';
import BlueprintInfoActivity from './BlueprintInfoActivity.jsx';

class BlueprintInfo extends React.Component {
  state = {
    copying: 1,
    invention: 1,
    manufacturing: 1,
    reaction: 1,
    research_material: 1,
    research_time: 1,
  }

  updateRuns = (key, val) => {
    this.setState(() => {
      let stateUpd = {};
      stateUpd[key] = val;
      return stateUpd;
    });
  };

  render() {
    return <div>
      <hr />
      <BlueprintInfoHeader blueprint={this.props.blueprint} />
      <hr />
      <Accordion>
        {this.props.blueprint.activities.map((activity) => <BlueprintInfoActivity
          key={activity.activity_type}
          activity={activity}
          runVal={this.state[activity.activity_type]}
          updateRuns={this.updateRuns}
          maxProdLimit={this.props.blueprint.max_production_limit}
          materialEfficiency={this.props.blueprint.material_efficiency}
          timeEfficiency={this.props.blueprint.time_efficiency}
        />)}
      </Accordion>
      <hr />
    </div>;
  }
}

export default BlueprintInfo;
