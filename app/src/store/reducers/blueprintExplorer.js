const initialState = {
  search: '',
  type: '',
};

const blueprintExplorer = (state=initialState, action) => {
  state = {...state};
  switch(action.type) {
    case 'blueprintExplorer|setSearch':
      state.search = action.payload.search;
      return state;

    case 'blueprintExplorer|setType':
      state.type = action.payload.type;
      console.log(state);
      return state;

    default:
      return state;
  }
};

export default blueprintExplorer;
