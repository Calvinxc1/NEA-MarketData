const initialState = {
  hoverType: null,
  hoverId: null,
  linkWeight: {
    value: 'volume',
    name: 'Volume',
  },
  runs: 1,
  activeElement: {},
};

const prodChain = (state=initialState, action) => {
  state = {...state};

  switch(action.type) {
    case 'prodChain|addHover':
      state.hoverType = action.payload.hoverType;
      state.hoverId = action.payload.hoverId;
      return state;
    case 'prodChain|dropHover':
      state.hoverType = null;
      state.hoverId = null;
      return state;
    case 'prodChain|addClick':
      state.clickType = action.payload.clickType;
      state.clickId = action.payload.clickId;
      return state;
    case 'prodChain|dropClick':
      state.clickType = null;
      state.clickId = null;
      return state;
    case 'prodChain|setLinkWeight':
      state.linkWeight = action.payload.linkWeight;
      return state;
    case 'prodChain|setRuns':
      state.runs = action.payload.runs;
      return state;
    case 'prodChain|setActiveElement':
      state.activeElement = action.payload.element;
      return state;
    default:
      return state;
  }
};

export default prodChain;
