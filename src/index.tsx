import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import { store } from './app/store';
import { apolloClient } from './queries/apolloClient';
import { routes } from './routes';

import './index.scss';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <RouterProvider router={routes} />
      </Provider>
    </ApolloProvider>
  </React.StrictMode>
);

