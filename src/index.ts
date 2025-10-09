import { ApolloServer, gql } from "apollo-server";
import jwt from "jsonwebtoken";
import { schema } from "./graphql/schema.ts";
import { connectRabbitMQ, getChannel } from "./rabbitmq.js";

const SECRET_KEY = "supersecretkey123";

const startServer = async () => {
  try {
    const channel = await connectRabbitMQ();

    const server = new ApolloServer({
      schema,
      context: ({ req }) => {
        const authHeader = req.headers.authorization || "";
        let user = null;

        if (authHeader) {
          const token = authHeader.replace("Bearer ", "");
          try {
            user = jwt.verify(token, SECRET_KEY);
          } catch (err) {
            console.warn("Invalid token");
          }
        }

        return { user, channel };
      },
    });

    const { url } = await server.listen();
    console.log(`🚀 LogLens GraphQL API ready at ${url}`);

  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();