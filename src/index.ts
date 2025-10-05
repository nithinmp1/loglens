import { ApolloServer, gql } from "apollo-server";
import { schema } from "./graphql/schema.ts";

// Server
const server = new ApolloServer({ schema });

server.listen().then(({ url }) => {
  console.log(`🚀 LogLens GraphQL API ready at ${url}`);
});
