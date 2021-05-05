import {combineReducers, createStore} from 'redux';

import globalState from './reducers/globalState.js';
import prodChain from './reducers/prodChain.js';

const reducer = combineReducers({globalState, prodChain});
const store = createStore(reducer);

export default store;
