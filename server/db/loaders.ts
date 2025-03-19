import DataLoader from "dataloader";
import { ObjectId } from "mongodb";
import { EnergyReportDbObject } from "../__generated__/resolvers-types.ts";
import db from "./connection.ts";

export const energyReportsLoader = new DataLoader<
  ObjectId,
  EnergyReportDbObject[]
>(
  async (
    facilityIds: Array<ObjectId>
  ): Promise<Array<EnergyReportDbObject[]>> => {
    const reports = await db
      .collection("energyReports")
      .find({ facility_id: { $in: facilityIds } })
      .toArray();

    const reportsByFacility: Map<string, Array<any>> = new Map(
      facilityIds.map((id) => [id.toHexString(), []])
    );

    reports.forEach((report) => {
      return reportsByFacility
        .get(report.facility_id.toHexString())
        .push(report);
    });

    return facilityIds.map((id) => reportsByFacility.get(id.toHexString()));
  }
);

export const availableReportsDatesLoader = new DataLoader<ObjectId, any>(
  async (facilityIds: Array<ObjectId>) => {
    const dates = await db
      .collection("energyReports")
      .aggregate([
        {
          $match: {
            facility_id: { $in: facilityIds },
          },
        },
        {
          $group: {
            _id: {
              facility_id: "$facility_id",
              year: { $year: "$timestamp" },
              month: { $month: "$timestamp" },
              day: { $dayOfMonth: "$timestamp" },
            },
          },
        },
        {
          $project: {
            _id: 0,
            facility_id: "$_id.facility_id",
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

    const datesByFacility: Map<string, Array<any>> = new Map(
      facilityIds.map((id) => [id.toHexString(), []])
    );

    dates.forEach((date) => {
      datesByFacility.get(date.facility_id.toHexString()).push(date);
    });

    return facilityIds.map((id) => datesByFacility.get(id.toHexString()));
  }
);
