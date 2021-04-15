import React from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {ReactQueryDevtools} from 'react-query/devtools';

const queryClient = new QueryClient();
const queryWrapper = (Component) => {
  return (props) => <QueryClientProvider client={queryClient}>
    <Component {...props} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>;
}

export default queryWrapper;
