import { gql } from "apollo-server";

export const queryTypeDefs = gql`
  type Query {
    logs: [Log!]!

    # Fetch a single log by ID
    log(id: ID!): Log

    services: [Service!]!

    users: [User!]!
  }
`;
