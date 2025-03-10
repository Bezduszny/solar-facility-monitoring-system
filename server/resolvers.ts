import csv from "csv-parser";
import { DateTimeISOResolver } from "graphql-scalars";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import { ObjectId } from "mongodb";
import db from "./db/connection.ts";

const resolvers = {
  DateTimeISO: DateTimeISOResolver,
  Upload: GraphQLUpload,
  Facility: {
    id: (parent) => parent.id ?? parent._id,
    async energyReports(facility) {
      return db
        .collection("energyReports")
        .find({ facility_id: facility.id ?? facility._id })
        .toArray();
    },
    availableReportsDates: async (facility) => {
      return db
        .collection("energyReports")
        .aggregate([
          {
            $match: {
              facility_id: facility.id ?? facility._id,
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$timestamp" },
                month: { $month: "$timestamp" },
                day: { $dayOfMonth: "$timestamp" },
              },
            },
          },
          {
            $project: {
              _id: 0,
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                },
              },
            },
          },
          {
            $sort: { date: 1 },
          },
        ])
        .toArray();
    },
  },
  EnergyReport: {
    id: (x) => x.id ?? x._id,
  },
  Query: {
    async facility(_, { id }) {
      let collection = db.collection("facilities");
      let query = { _id: ObjectId.createFromHexString(id) };
      return await collection.findOne(query);
    },
    async facilities() {
      let collection = await db.collection("facilities");
      return await collection.find({}).toArray();
    },
    async energyReports(_, { facilityId, startTime, endTime }) {
      let query = { facilityId: ObjectId.createFromHexString(facilityId) };
      if (startTime && endTime) {
        query.timestamp = {
          $gte: new Date(startTime),
          $lte: new Date(endTime),
        };
      }
      return db.collection("energyReports").find(query).toArray();
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
      const update = await collection.updateOne(query, { $set: { ...args } });

      if (update.acknowledged) return await collection.findOne(query);

      return null;
    },
    async deleteFacility(_, { id }, context) {
      let collection = await db.collection("facilities");
      const dbDelete = await collection.deleteOne({
        _id: ObjectId.createFromHexString(id),
      });
      return dbDelete.acknowledged && dbDelete.deletedCount == 1 ? true : false;
    },
    uploadCSV: async (_, { file, facility_id }) => {
      const facilityCollection = await db.collection("facilities");
      const facility = await facilityCollection.findOne({ id: facility_id });

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
            data.facility_id = facility_id;
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

              console.log(result);
              resolve({
                success: true,
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
