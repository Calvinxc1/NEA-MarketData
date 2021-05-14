export const setActiveElement = (element={}) => ({
  type: 'productionChain|setActiveElement',
  payload: {element},
});

export const setHover = (type=null, id=null) => ({
  type: 'productionChain|setHover',
  payload: {type, id},
});

export const setLinkWeight = (linkWeight={value:'volume', name:'Volume'}) => ({
  type: 'productionChain|setLinkWeight',
  payload: {linkWeight},
});

export const setUnits = (units=1) => ({
  type: 'productionChain|setUnits',
  payload: {units},
});

export const reset = () => ({type: 'productionChain|reset'});
