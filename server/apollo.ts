import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { DIRECTIVES } from "@graphql-codegen/typescript-mongodb";
import { readFileSync } from "fs";
import { gql } from "graphql-tag";
import {
  availableReportsDatesLoader,
  energyReportsLoader,
} from "./db/loaders.ts";
import resolvers from "./resolvers.ts";

import { mergeTypeDefs } from "@graphql-tools/merge";

const baseTypeDefs = gql(readFileSync("schema.graphql", { encoding: "utf-8" }));

const typeDefs = mergeTypeDefs([DIRECTIVES, baseTypeDefs]);

// const schema = makeExecutableSchema({
//   typeDefs,
//   resolvers
// })

export type ApolloContext = {
  energyReportsLoader: typeof energyReportsLoader;
  availableReportsDatesLoader: typeof availableReportsDatesLoader;
};

export const createContext = async (): Promise<ApolloContext> => ({
  energyReportsLoader,
  availableReportsDatesLoader,
});

const apolloServer = new ApolloServer<ApolloContext>({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

export default apolloServer;
