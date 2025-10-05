import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { addLog } from './mutations.js';
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
    addLog,
  },
});

export const schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
});
