export const setSearch = (search='') => ({
  type: 'blueprintExplorer|setSearch',
  payload: {search},
});

export const setType = (type='') => ({
  type: 'blueprintExplorer|setType',
  payload: {type},
});
