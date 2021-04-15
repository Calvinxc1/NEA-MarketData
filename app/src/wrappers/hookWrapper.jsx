import React from 'react';

const hookWrapper = (Component, hook, params) => (props) => {
  const calledHook = hook(...params)
  return <Component {...props} hook={calledHook} />
}

export default hookWrapper;
