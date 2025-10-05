import { ApolloServer, gql } from "apollo-server";
import jwt from "jsonwebtoken";
import { schema } from "./graphql/schema.ts";

const SECRET_KEY = "supersecretkey123";

// Server
const server = new ApolloServer({ 
  schema,
  context: ({ req }) => {
    const authHeader = req.headers.authorization || "";
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      try {
        const user = jwt.verify(token, SECRET_KEY);
        return { user };
      } catch (err) {
        console.warn("Invalid token");
      }
    }
    return {};
  },

 });

server.listen().then(({ url }) => {
  console.log(`🚀 LogLens GraphQL API ready at ${url}`);
});
