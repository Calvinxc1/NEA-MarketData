import React from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Container from 'react-bootstrap/Container';

import NavigationBar from './components/navbar/NavigationBar.jsx';
import Blueprint from './components/blueprint/Blueprint.jsx';
import BlueprintExplorer from './components/blueprint_explorer/BlueprintExplorer.jsx';
import Home from './components/home/Home.jsx';
import MatChainSankey from './components/matChain/MatChainSankey.jsx';
import NotFound from './components/not_found/NotFound.jsx';
import queryWrapper from './wrappers/queryWrapper.jsx';

const App = () => {
  return <Router>
    <NavigationBar />
    <Container>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/blueprint" exact>
          <BlueprintExplorer />
        </Route>
        <Route path="/blueprint/:item_id">
          <Blueprint />
        </Route>
        <Route path="/production/matChain/:type_id">
          <MatChainSankey />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Container>
  </Router>;
}

export default queryWrapper(App);
