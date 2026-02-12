import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Define the HTTP link
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPH_TARGET,
});

// Add headers using setContext
const quantammLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-graphql-client-name': 'quantAmmFrontend',
      'x-graphql-client-version': '1.0.0',
    },
  };
});

// Create the Apollo Client
export const apolloClient = new ApolloClient({
  link: quantammLink.concat(httpLink), // Chain the auth link with the HTTP link
  cache: new InMemoryCache(),
});
