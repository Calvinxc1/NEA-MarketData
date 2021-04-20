import React from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Container from 'react-bootstrap/Container';

import NavigationBar from './components/navbar/NavigationBar.jsx';
import Blueprint from './components/blueprint/Blueprint.jsx';
import BlueprintExplorer from './components/blueprint_explorer/BlueprintExplorer.jsx';
import Home from './components/home/Home.jsx';
import MatChain from './components/matChain/MatChain.jsx';
import NotFound from './components/not_found/NotFound.jsx';
import queryWrapper from './wrappers/queryWrapper.jsx';

const App = () => {
  return <Router>
    <NavigationBar />
    <hr />
    <Container>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/blueprint" component={BlueprintExplorer} />
        <Route path="/blueprint/:item_id" component={Blueprint} />
        <Route path="/production/matChain/:type_id" component={MatChain} />
        <Route component={NotFound} />
      </Switch>
    </Container>
  </Router>;
}

export default queryWrapper(App);
