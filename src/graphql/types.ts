import { gql } from "apollo-server";

export const typeDefs = gql`
  type Log {
    id: ID!
    service: Service!
    level: LogLevel!
    message: String!
    timestamp: String!
  }

  enum LogLevel {
    INFO
    WARN
    ERROR
    DEBUG
  }

  type Service {
    id: ID!
    name: String!
    description: String
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: Role!
  }

  enum Role {
    ADMIN
    VIEWER
  }
`;
