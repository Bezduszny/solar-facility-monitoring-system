import { ObjectId } from "mongodb";
import db from "./db/connection.js";

const resolvers = {
  Facility: {
    id: (parent) => parent.id ?? parent._id,
  },
  Query: {
    async facility(_, { id }) {
      let collection = db.collection("facilities");
      let query = { _id: ObjectId.createFromHexString(id)}
      return await collection.findOne(query)
    },
    async facilities() {
      let collection = await db.collection("facilities");
      return await collection.find({}).toArray();
    },
  },
  Mutation: {
    async createFacility(_, { name, nominalPower }, context) {
      let collection = await db.collection("facilities");
      const insert = await collection.insertOne({ name, nominalPower });
      if (insert.acknowledged)
        return { name, nominalPower, id: insert.insertedId };
      return null;
    },
    async updateFacility(_, args, context) {
      const id = ObjectId.createFromHexString(args.id);
      let query = { _id: id };
      let collection = await db.collection("facilities");
      const update = await collection.updateOne(
        query,
        { $set: { ...args } }
      );

      if (update.acknowledged)
        return await collection.findOne(query);

      return null;
    },
    async deleteFacility(_, { id }, context) {
      let collection = await db.collection("facilities");
      const dbDelete = await collection.deleteOne({ _id: ObjectId.createFromHexString(id) });
      return dbDelete.acknowledged && dbDelete.deletedCount == 1 ? true : false;
    },
  },
};

export default resolvers;
