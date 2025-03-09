import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import {
  CREATE_FACILITY,
  DELETE_FACILITY,
} from "../../client/src/api/mutations.ts";
import {
  GET_FACILITIES,
  GET_FACILITY_NO_REPORTS,
} from "../../client/src/api/queries.ts";
import apolloServer from "../apollo.ts";
import db from "../db/connection.ts";

describe("GraphQL API", () => {
  beforeAll(async () => {
    await apolloServer.start();
  });

  afterAll(async () => {
    await apolloServer.stop();
  });

  afterEach(async () => {
    await db.dropDatabase();
  });

  describe("Queries", () => {
    it("should fetch a facility by ID", async () => {
      const facility = await db.collection("facilities").insertOne({
        name: "Test Facility",
        nominalPower: 1000,
      });

      const response = await apolloServer.executeOperation({
        query: GET_FACILITY_NO_REPORTS,
        variables: { id: facility.insertedId.toString() },
      });
      const result = response.body.singleResult;

      expect(result.errors).toBeUndefined();
      expect(result.data.facility).toEqual({
        id: facility.insertedId.toString(),
        name: "Test Facility",
        nominalPower: 1000,
      });
    });

    it("should fetch all facilities", async () => {
      await db.collection("facilities").insertMany([
        { name: "Facility 1", nominalPower: 1000 },
        { name: "Facility 2", nominalPower: 2000 },
      ]);

      const response = await apolloServer.executeOperation({
        query: GET_FACILITIES,
      });
      const result = response.body.singleResult;

      expect(result.errors).toBeUndefined();
      expect(result.data.facilities).toHaveLength(2);
    });
  });

  describe("Mutations", () => {
    it("should create a facility", async () => {
      const response = await apolloServer.executeOperation({
        query: CREATE_FACILITY,
        variables: {
          name: "New Facility",
          nominalPower: 1500,
        },
      });
      const result = response.body.singleResult;

      expect(result.errors).toBeUndefined();
      expect(result.data.createFacility).toEqual({
        id: expect.any(String),
        name: "New Facility",
        nominalPower: 1500,
      });
    });

    it("should delete a facility", async () => {
      const facility = await db.collection("facilities").insertOne({
        name: "Facility to Delete",
        nominalPower: 1000,
      });

      const response = await apolloServer.executeOperation({
        query: DELETE_FACILITY,
        variables: { id: facility.insertedId.toString() },
      });

      const result = response.body.singleResult;

      expect(result.errors).toBeUndefined();
      expect(result.data.deleteFacility).toBe(true);

      const deletedFacility = await db
        .collection("facilities")
        .findOne({ _id: facility.insertedId });

      expect(deletedFacility).toBeNull();
    });
  });
});
