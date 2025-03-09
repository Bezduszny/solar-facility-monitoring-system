import { useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { DELETE_FACILITY } from "../api/mutations";
import { GET_FACILITIES } from "../api/queries";

interface Facility {
  id: string;
  name?: string;
  nominalPower?: number;
}

function FacilityRow({ facility }: { facility: Facility }) {
  const [deleteFacility, {}] = useMutation(DELETE_FACILITY, {
    refetchQueries: ["facilities"],
  });

  const actionButtonStyle = {
    textTransform: "none",
    fontSize: "0.875rem",
    fontWeight: "medium",
  };

  return (
    <TableRow
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        "&:hover": { backgroundColor: "action.hover" },
      }}
    >
      <TableCell>{facility.name}</TableCell>
      <TableCell>{facility.nominalPower}</TableCell>
      <TableCell>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            component={Link}
            to={`facility/${facility.id}`}
            variant="outlined"
            sx={actionButtonStyle}
          >
            View
          </Button>
          <Button
            component={Link}
            to={`/edit/${facility.id}`}
            variant="outlined"
            sx={actionButtonStyle}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={actionButtonStyle}
            onClick={() => {
              deleteFacility({ variables: { id: facility.id } });
            }}
          >
            Delete
          </Button>
        </Box>
      </TableCell>
    </TableRow>
  );
}

export default function Facilities() {
  const { loading, error, data } = useQuery(GET_FACILITIES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  function renderRecords() {
    return data.facilities.map((facility: Facility) => (
      <FacilityRow facility={facility} key={facility.id} />
    ));
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Facilities
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="employee records table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Nominal Power</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderRecords()}</TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
