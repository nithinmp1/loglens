import { gql } from "apollo-server";

export const mutationTypeDefs = gql`
  input AddLogInput {
    service: String!
    level: LogLevel!
    message: String!
  }

  input CreateServiceInput {
    name: String!
    description: String
  }

  input CreateUserInput {
    username: String!
    email: String!
    role: Role!
  }

  type Mutation {
    addLog(input: AddLogInput!): Log!

    createService(input: CreateServiceInput!): Service!

    createUser(input: CreateUserInput!): User!
  }
`;
