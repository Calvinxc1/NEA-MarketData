import {createStore} from 'redux';

const initialState = {
  hoverType: null,
  hoverId: null,
};

const reducer = (state=initialState, action) => {
  let stateCopy = {...state}

  switch(action.type) {
    case 'ADD_HOVER':
      stateCopy.hoverType = action.payload.hoverType;
      stateCopy.hoverId = action.payload.hoverId;
      break;
    case 'DROP_HOVER':
      stateCopy.hoverType = null;
      stateCopy.hoverId = null;
      break;
    default:
      break;
  }

  return stateCopy
}

const store = createStore(reducer);

export default store;
