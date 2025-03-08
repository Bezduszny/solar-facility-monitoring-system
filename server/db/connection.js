import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.DB_URI || "";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  await client.connect();
  await client.db("solar-facility-monitoring-system-wp").command({ ping: 1 });
  console.log(
    "Pinged your deployment. You successfully connected to MongoDB!"
  );
} catch(err) {
  console.error(err);
}

let db = client.db("solar-facility-monitoring-system-wp");

export default db;