import { useMutation, useQuery } from "@apollo/client";
import { Box, Button, Input, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

import { LineChart } from "@mui/x-charts";
import { UPLOAD_CSV } from "../api/mutations";
import { GET_FACILITY } from "../api/queries";

export default function FacilityView() {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery(GET_FACILITY, {
    variables: { id: id },
  });

  if (loading) return "Loading";
  if (error) return `Error: ${error}`;
  console.log(data.facility.energyReports);

  const xAxisData = data.facility.energyReports.map(
    (report) => new Date(report.timestamp)
  );
  const yAxisData = data.facility.energyReports.map(
    (report) => report.active_power_kW
  );
  const y2AxisData = data.facility.energyReports.map(
    (report) => report.energy_kWh
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Facility: {data.facility.name}</Typography>
      <Typography>Nominal Power: {data.facility.nominalPower}</Typography>
      <FileUploadForm facility_id={id} />
      {/* {data.facility.energyReports.map((report) => {
        return <div key={report.id}>{JSON.stringify(report)}</div>;
      })} */}

      {data.facility.energyReports?.length > 0 && (
        <>
          <LineChart
            xAxis={[
              {
                data: xAxisData,
                scaleType: "time",
                valueFormatter: (date) => new Date(date).toLocaleTimeString(), // Format timestamp for display
              },
            ]}
            series={[
              {
                data: yAxisData,
                label: "Active Power (kW)",
                showMark: false,
              },
            ]}
            width={800}
            height={400}
            grid={{ horizontal: true, vertical: true }}
          />
          <LineChart
            xAxis={[
              {
                data: xAxisData,
                scaleType: "time",
                valueFormatter: (date) => new Date(date).toLocaleTimeString(), // Format timestamp for display
              },
            ]}
            series={[
              {
                data: y2AxisData,
                label: "Energy (kWh)",
                showMark: false,
                color: "#e15759",
              },
            ]}
            width={800}
            height={400}
            grid={{ horizontal: true, vertical: true }}
          />
        </>
      )}
    </Box>
  );
}

function FileUploadForm({ facility_id }: { facility_id: string }) {
  const [uploadCSV, { loading, error, data }] = useMutation(UPLOAD_CSV, {
    refetchQueries: ["facility"],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      const result = await uploadCSV({
        variables: { file, facility_id: facility_id },
        context: {
          headers: {
            "apollo-require-preflight": true,
          },
        },
      });
      console.log("Mutation result:", result);
      alert("File uploaded successfully!");
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Failed to upload file.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="file"
        name="file"
        required
        slotProps={{ input: { accept: ".csv" } }}
      />
      <Button type="submit" disabled={loading} variant="outlined">
        {loading ? "Uploading..." : "Upload"}
      </Button>
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      {data && (
        <>
          <p style={{ color: "green" }}>
            {data.uploadCSV.success && "Success!"}
          </p>
          <p>Inserted {data.uploadCSV.insertedCount} entries.</p>
          <p>Updated {data.uploadCSV.modifiedCount} entries.</p>
          <p>Ignored {data.uploadCSV.duplicatesIgnored} duplicated entries.</p>
        </>
      )}
    </form>
  );
}
