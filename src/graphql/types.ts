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
