const initialState = {
  runs: 1
};

const blueprintItem = (state=initialState, action) => {
  state = {...state};
  switch(action.type) {
    case 'blueprintItem|setRuns':
      state.runs = action.payload.runs;
      return state;

    default:
      return state;
  }
};

export default blueprintItem;
