import React from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import {Provider} from 'react-redux';

import NavigationBar from './components/Navbar/NavigationBar.jsx';
import BlueprintItem from './components/BlueprintItem/BlueprintItem.jsx';
import BlueprintExplorer from './components/BlueprintExplorer/BlueprintExplorer.jsx';
import Home from './components/Home/Home.jsx';
import ProductionChain from './components/ProductionChain/ProductionChain.jsx';
import ProductionQueue from './components/ProductionQueue/ProductionQueue.jsx';
import NotFound from './components/NotFound/NotFound.jsx';
import queryWrapper from './wrappers/queryWrapper.jsx';
import store from './store/store.js';

const App = () => {
  return <Provider store={store}>
    <Router>
      <NavigationBar />
      <hr />
      <Container>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/blueprint/explorer' component={BlueprintExplorer} />
          <Route exact path='/blueprint/item/:item_id' component={BlueprintItem} />
          <Route exact path='/production/chain/:type_id' component={ProductionChain} />
          <Route exact path='/production/queue/' component={ProductionQueue} />
          <Route component={NotFound} />
        </Switch>
      </Container>
    </Router>
  </Provider>;
}

export default queryWrapper(App);
