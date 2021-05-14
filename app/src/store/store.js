import {combineReducers, createStore} from 'redux';

import globalState from './reducers/globalState.js';
import productionChain from './reducers/productionChain.js';
import productionQueue from './reducers/productionQueue.js';

const reducer = combineReducers({globalState, productionChain, productionQueue});
const store = createStore(reducer);

export default store;
