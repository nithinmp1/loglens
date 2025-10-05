import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { addLog, register, login } from './mutations.js';
import { logsQuery } from "./queries.js";

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    health: {
      type: GraphQLString,
      resolve: () => "LogLens API is running 🚀",
    },
    logs: logsQuery,
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    register,
    login,
    addLog,
  },
});

export const schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
});
