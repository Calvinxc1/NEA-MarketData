const initialState = {
  deleteQueue: {},
  quickbar: [],
};

const productionQueue = (state=initialState, action) => {
  state = {...state};
  switch(action.type) {
    case 'productionQueue|setDeleteQueue':
      state.deleteQueue = action.payload.deleteQueue;
      return state;

    case 'productionQueue|setQuickbar':
      state.quickbar = action.payload.quickbar;
      return state;

    default:
      return state;
  }
};

export default productionQueue;
