import { MongoClient, ServerApiVersion } from "mongodb";

import * as crypto from "node:crypto";

const uri = process.env.DB_URI || "";
const dbName = process.env.DB_NAME || crypto.randomBytes(20).toString("hex");

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  await client.connect();
  await client.db(dbName).command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
} catch (err) {
  console.error(err);
}

let db = client.db(dbName);

try {
  await db
    .collection("energyReports")
    .createIndex({ facility_id: 1, timestamp: 1 }, { unique: true });
  console.log("Unique compound index created.");
} catch (err) {
  if (err.code === 85) {
    console.log("Unique compound index already exists.");
  } else {
    console.error("Error creating index:", err);
  }
}

export default db;
