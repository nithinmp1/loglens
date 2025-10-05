import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull } from 'graphql';

export const LogType = new GraphQLObjectType({
  name: 'Log',
  fields: {
    id: { type: GraphQLID },
    message: { type: new GraphQLNonNull(GraphQLString) },
    level: { type: GraphQLString },
    service: { type: GraphQLString },
    timestamp: { type: GraphQLString },
  },
});

export const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    token: { type: GraphQLString },
  },
});
