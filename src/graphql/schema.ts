import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { addLogToQueue, addLog, register, login } from './mutations.ts';
import { logsQuery } from "./queries.ts";
import { newLogSubscription } from "./subscriptions.ts";

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
    addLogToQueue,
  },
});

const Subscription = new GraphQLObjectType({
  name: "Subscription",
  fields: {
    newLog: newLogSubscription,
  },
});

export const schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
    subscription: Subscription,
});
