export const setActiveElement = (element={}) => ({
  type: 'prodChain|setActiveElement',
  payload: {element},
});

export const setHover = (type=null, id=null) => ({
  type: 'prodChain|setHover',
  payload: {type, id},
});

export const setLinkWeight = (linkWeight={value:'volume', name:'Volume'}) => ({
  type: 'prodChain|setLinkWeight',
  payload: {linkWeight},
});

export const setUnits = (units=1) => ({
  type: 'prodChain|setUnits',
  payload: {units},
});

export const reset = () => ({type: 'prodChain|reset'});
