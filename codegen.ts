const config = {
  schema: 'https://api-v3.balancer.fi/', // Point to your GraphQL endpoint
  documents: `./src/queries/*.graphql`, // Adjusted to include all .graphql files
  generates: {
    [`./src/__generated__/graphql-types.ts`]: {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
        gqlImport: 'graphql-tag',
      },
    },
  },
  overwrite: true,
};
module.exports = config;
