export const setDeleteQueue = (deleteQueue={}) => ({
  type: 'productionQueue|setDeleteQueue',
  payload: {deleteQueue},
});

export const setQuickbar = (quickbar=[]) => ({
  type: 'productionQueue|setQuickbar',
  payload: {quickbar},
});
