import { ApolloServer, gql } from "apollo-server";

// Schema
const typeDefs = gql`
  type Log {
    id: ID!
    service: String!
    level: String!
    message: String!
    timestamp: String!
  }

  type Query {
    logs: [Log]
  }

  type Mutation {
    addLog(service: String!, level: String!, message: String!): Log
  }
`;

// Mock DB
const logs: any[] = [];

// Resolvers
const resolvers = {
  Query: {
    logs: () => logs,
  },
  Mutation: {
    addLog: (_: any, { service, level, message }: any) => {
      const log = {
        id: logs.length + 1,
        service,
        level,
        message,
        timestamp: new Date().toISOString(),
      };
      logs.push(log);
      return log;
    },
  },
};

// Server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 LogLens GraphQL API ready at ${url}`);
});
