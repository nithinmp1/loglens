import { gql } from "apollo-server";
import { typeDefs as coreTypes } from "./types.ts";
import { queryTypeDefs } from "./queries.ts";
import { mutationTypeDefs } from "./mutations.ts";

export const typeDefs = gql`
  ${coreTypes}
  ${queryTypeDefs}
  ${mutationTypeDefs}
`;
