export const addHover = (hoverType, hoverId) => ({
  type: 'prodChain|addHover',
  payload: {hoverType, hoverId},
});

export const dropHover = () => ({type: 'prodChain|dropHover'});

export const setLinkWeight = (linkWeight) => ({
  type: 'prodChain|setLinkWeight',
  payload: {linkWeight},
});

export const setRuns = (runs) => ({
  type: 'prodChain|setRuns',
  payload: {runs},
});

export const setActiveElement = (element={}) => ({
  type: 'prodChain|setActiveElement',
  payload: {element}
});
