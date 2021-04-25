import React from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Container from 'react-bootstrap/Container';

import NavigationBar from './components/Navbar/NavigationBar.jsx';
import BlueprintItemInfo from './components/BlueprintItemInfo/BlueprintItemInfo.jsx';
import BlueprintExplorer from './components/BlueprintExplorer/BlueprintExplorer.jsx';
import Home from './components/Home/Home.jsx';
import ProdChain from './components/ProdChain/ProdChain.jsx';
import NotFound from './components/NotFound/NotFound.jsx';
import queryWrapper from './wrappers/queryWrapper.jsx';

const App = () => {
  return <Router>
    <NavigationBar />
    <hr />
    <Container>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/blueprint/explorer' component={BlueprintExplorer} />
        <Route exact path='/blueprint/item/:item_id' component={BlueprintItemInfo} />
        <Route exact path='/production/chain/:type_id' component={ProdChain} />
        <Route component={NotFound} />
      </Switch>
    </Container>
  </Router>;
}

export default queryWrapper(App);
