import csv from "csv-parser";
import { DateTimeISOResolver } from "graphql-scalars";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import { ObjectId } from "mongodb";
import {
  EnergyReportDbObject,
  FacilityDbObject,
  Resolvers,
} from "./__generated__/resolvers-types.ts";
import { ApolloContext } from "./apollo.ts";
import db from "./db/connection.ts";

const resolvers: Resolvers = {
  DateTimeISO: DateTimeISOResolver,
  Upload: GraphQLUpload,
  Facility: {
    id: (facility) => {
      return facility._id.toHexString();
    },
    energyReports: async (facility, _, context: ApolloContext) => {
      return await context.energyReportsLoader.load(facility._id);
    },
    availableReportsDates: async (facility, _, context) => {
      return await context.availableReportsDatesLoader.load(facility._id);
    },
  },
  EnergyReport: {
    id: (report) => report._id.toHexString(),
  },
  Query: {
    async facility(_, { id }) {
      let collection = db.collection<FacilityDbObject>("facilities");
      let query = { _id: ObjectId.createFromHexString(id) };
      return await collection.findOne(query);
    },
    async facilities() {
      let collection = await db.collection<FacilityDbObject>("facilities");
      return await collection.find({}).toArray();
    },
    async energyReports(_, { facility_id }) {
      let query = {
        facility_id: ObjectId.createFromHexString(facility_id),
      };
      return await db
        .collection<EnergyReportDbObject>("energyReports")
        .find(query)
        .toArray();
    },
  },
  Mutation: {
    async createFacility(_, { name, nominalPower }, context) {
      let collection = await db.collection("facilities");
      const insert = await collection.insertOne({ name, nominalPower });

      if (insert.acknowledged)
        return (await collection.findOne({
          _id: insert.insertedId,
        })) as FacilityDbObject;

      return null;
    },
    async updateFacility(_, args, context) {
      const id = ObjectId.createFromHexString(args.id);
      let query = { _id: id };
      let collection = await db.collection("facilities");
      const update = await collection.updateOne(query, { $set: { ...args } });

      if (update.acknowledged)
        return (await collection.findOne(query)) as FacilityDbObject;

      return null;
    },
    async deleteFacility(_, { id }) {
      let collection = await db.collection("facilities");
      const dbDelete = await collection.deleteOne({
        _id: ObjectId.createFromHexString(id),
      });

      return dbDelete.acknowledged && dbDelete.deletedCount == 1 ? true : false;
    },
    async uploadCSV(_, { file, facility_id }) {
      const facilityCollection = await db.collection("facilities");
      const facility = await facilityCollection.findOne({
        _id: ObjectId.createFromHexString(facility_id),
      });

      if (!facility) {
        throw new Error("Facility not found");
      }

      const { createReadStream } = await file;
      const stream = createReadStream();
      const results = [];

      return new Promise((resolve, reject) => {
        stream
          .pipe(csv())
          .on("data", (data) => {
            data.facility_id = ObjectId.createFromHexString(facility_id);
            data.timestamp = new Date(data.timestamp + "Z");
            results.push(data);
          })
          .on("end", async () => {
            try {
              const collection = db.collection("energyReports");
              const operations = results.map((report) => ({
                updateOne: {
                  filter: {
                    facility_id: report.facility_id,
                    timestamp: report.timestamp,
                  },
                  update: { $set: report },
                  upsert: true,
                },
              }));

              const result = await collection.bulkWrite(operations, {
                ordered: false,
              });

              resolve({
                insertedCount: result.upsertedCount,
                modifiedCount: result.modifiedCount,
                duplicatesIgnored:
                  results.length - result.upsertedCount - result.modifiedCount,
              });
            } catch (err) {
              reject("Failed to process CSV file.");
            }
          })
          .on("error", (error) => {
            console.error("Error parsing CSV:", error);
            reject("Failed to process CSV file");
          });
      });
    },
  },
};

export default resolvers;
