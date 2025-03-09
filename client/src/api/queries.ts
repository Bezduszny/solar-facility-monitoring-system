import { gql } from "@apollo/client";

export const GET_FACILITY = gql`
  query facility($id: ID!) {
    facility(id: $id) {
      name
      nominalPower
      energyReports {
        id
        timestamp
        facility_id
        active_power_kW
        energy_kWh
      }
    }
  }
`;

export const GET_FACILITY_NO_REPORTS = gql`
  query facility($id: ID!) {
    facility(id: $id) {
      id
      name
      nominalPower
    }
  }
`;

export const GET_FACILITIES = gql`
  query facilities {
    facilities {
      id
      name
      nominalPower
    }
  }
`;
