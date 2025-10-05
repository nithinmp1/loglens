import { ApolloServer, gql } from "apollo-server";
import { typeDefs } from "./graphql/schema.ts";

const logs: any[] = [];

const resolvers = {
  Query: {
    logs: () => logs,
    log: (_: any, { id }: any) => logs.find((log) => log.id == id),
    services: () => [{ id: "1", name: "Auth", description: "Auth Service" }],
    users: () => [{ id: "1", username: "admin", email: "admin@test.com", role: "ADMIN" }],
  },
  Mutation: {
    addLog: (_: any, { input }: any) => {
      const log = {
        id: logs.length + 1,
        service: { id: "1", name: input.service },
        level: input.level,
        message: input.message,
        timestamp: new Date().toISOString(),
      };
      logs.push(log);
      return log;
    },
    createService: (_: any, { input }: any) => ({
      id: "2",
      name: input.name,
      description: input.description,
    }),
    createUser: (_: any, { input }: any) => ({
      id: "2",
      username: input.username,
      email: input.email,
      role: input.role,
    }),
  },
};

// Server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 LogLens GraphQL API ready at ${url}`);
});
