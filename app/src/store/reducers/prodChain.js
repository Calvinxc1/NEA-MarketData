const initialState = {
  activeElement: {},
  hover: {},
  linkWeight: {
    value: 'volume',
    name: 'Volume',
  },
  units: 1,
};

const prodChain = (state=initialState, action) => {
  state = {...state};
  switch(action.type) {
    case 'prodChain|setActiveElement':
      state.activeElement = action.payload.element;
      return state;

    case 'prodChain|setHover':
      state.hover = {
        type: action.payload.type,
        id: action.payload.id,
      };
      return state;

    case 'prodChain|setLinkWeight':
      state.linkWeight = action.payload.linkWeight;
      return state;

    case 'prodChain|setUnits':
      state.units = action.payload.units;
      return state;

    case 'prodChain|reset':
      state = initialState;
      return state;

    default:
      return state;
  }
};

export default prodChain;
