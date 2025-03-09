import "dotenv/config";

import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import "dotenv/config";
import express from "express";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import apolloServer from "./apollo.ts";
const PORT = process.env.PORT || 5050;

const app = express();

app.use(cors());

await apolloServer.start();

app.use(
  "/graphql",
  express.json(),
  graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 1 }),
  expressMiddleware(apolloServer)
);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
