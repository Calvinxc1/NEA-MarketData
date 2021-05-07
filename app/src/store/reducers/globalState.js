const initialState = {
  selectedStation: null,
};

const globalState = (state=initialState, action) => {
  state = {...state};

  switch(action.type) {
    case 'globalState|updateSelectedStation':
      state.selectedStation = action.payload.station;
      return state;
    default:
      return state;
  }
};

export default globalState;
