import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';
import cors from "cors";
import 'dotenv/config';
import express from "express";
import { readFileSync } from "fs";
import gql from "graphql-tag";
import resolvers from "./resolvers.ts";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

const typeDefs = gql(
  readFileSync("schema.graphql", {
    encoding: "utf-8",
  })
);

const apolloServer = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});
await apolloServer.start();


app.use(
  '/graphql',
  cors(),
  express.json(),
  expressMiddleware(apolloServer),
);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
