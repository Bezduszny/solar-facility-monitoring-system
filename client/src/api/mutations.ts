import { gql } from "@apollo/client";

export const UPLOAD_CSV = gql`
  mutation uploadCSV($file: Upload!, $facility_id: ID!) {
    uploadCSV(file: $file, facility_id: $facility_id) {
      success
      insertedCount
      modifiedCount
      duplicatesIgnored
    }
  }
`;

export const CREATE_FACILITY = gql`
  mutation createFacility($name: String!, $nominalPower: Int!) {
    createFacility(name: $name, nominalPower: $nominalPower) {
      id
      name
      nominalPower
    }
  }
`;

export const UPDATE_FACILITY = gql`
  mutation updateFacility($id: ID!, $name: String!, $nominalPower: Int) {
    updateFacility(id: $id, name: $name, nominalPower: $nominalPower) {
      id
      name
      nominalPower
    }
  }
`;

export const DELETE_FACILITY = gql`
  mutation deleteFacility($id: ID!) {
    deleteFacility(id: $id)
  }
`;
