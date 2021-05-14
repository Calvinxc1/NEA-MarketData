const initialState = {
  activeElement: {},
  hover: {},
  linkWeight: {
    value: 'volume',
    name: 'Volume',
  },
  units: 1,
};

const productionChain = (state=initialState, action) => {
  state = {...state};
  switch(action.type) {
    case 'productionChain|setActiveElement':
      state.activeElement = action.payload.element;
      return state;

    case 'productionChain|setHover':
      state.hover = {
        type: action.payload.type,
        id: action.payload.id,
      };
      return state;

    case 'productionChain|setLinkWeight':
      state.linkWeight = action.payload.linkWeight;
      return state;

    case 'productionChain|setUnits':
      state.units = action.payload.units;
      return state;

    case 'productionChain|reset':
      state = initialState;
      return state;

    default:
      return state;
  }
};

export default productionChain;
