import { useMutation, useQuery } from "@apollo/client";
import { Box, Button, Input, Paper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

import { LineChart } from "@mui/x-charts";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import { UPLOAD_CSV } from "../api/mutations";
import { GET_FACILITY } from "../api/queries";

dayjs.extend(utc);

export default function FacilityView() {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery(GET_FACILITY, {
    variables: { id: id },
  });
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const allowedDates: Array<Dayjs> =
    data?.facility.availableReportsDates.map((date) => dayjs.utc(date.date)) ||
    [];

  useEffect(() => {
    if (!selectedDate && allowedDates.length > 0) {
      setSelectedDate(allowedDates[0]);
    }
  }, [data]);

  if (loading) return "Loading";
  if (error) return `Error: ${error}`;

  const reports = data.facility.energyReports.filter((report) =>
    dayjs.utc(report.timestamp).isSame(selectedDate, "day")
  );

  const xAxisData = reports.map((report) =>
    dayjs.utc(report.timestamp).valueOf()
  );
  const yAxisData = reports.map((report) => report.active_power_kW);
  const y2AxisData = reports.map((report) => report.energy_kWh);

  const shouldDisableDate = (date: Dayjs) => {
    return !allowedDates.some((allowedDate) => date.isSame(allowedDate, "day"));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Facility: {data.facility.name}</Typography>
      <Typography>Nominal Power: {data.facility.nominalPower}</Typography>
      <FileUploadForm facility_id={id} />

      {data.facility.energyReports?.length > 0 && (
        <Paper>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select a date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              shouldDisableDate={shouldDisableDate}
              timezone="UTC"
            />
          </LocalizationProvider>
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            <LineChart
              xAxis={[
                {
                  data: xAxisData,
                  scaleType: "time",
                  valueFormatter: (date) => new Date(date).toLocaleTimeString(),
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
                  valueFormatter: (date) => new Date(date).toLocaleTimeString(),
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
          </Box>
        </Paper>
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
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  return (
    <Paper sx={{ p: 3, my: 3 }}>
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
            <p>
              Ignored {data.uploadCSV.duplicatesIgnored} duplicated entries.
            </p>
          </>
        )}
      </form>
    </Paper>
  );
}
