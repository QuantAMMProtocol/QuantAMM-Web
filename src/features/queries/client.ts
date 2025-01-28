import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const getUri = () => {
  const graphTarget = import.meta.env.VITE_GRAPH_TARGET;
  switch (graphTarget) {
    case 'local':
      return 'http://18.170.226.37:4000/graphql';
    case 'mainnet':
      return 'https://api-v3.balancer.fi/';
    default:
      return 'https://test-api-v3.balancer.fi/';
  }
};

export const client = new ApolloClient({
  link: new HttpLink({
    uri: getUri(),
  }),
  cache: new InMemoryCache(),
});
