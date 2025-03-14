import { Box, Button, Paper, TextField, Typography } from "@mui/material";

import { useMutation, useQuery } from "@apollo/client";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { CREATE_FACILITY, UPDATE_FACILITY } from "../api/mutations";
import { GET_FACILITY_NO_REPORTS } from "../api/queries";

interface FacilityFormData {
  name: string;
  nominalPower: number | null;
}

interface FacilityFormBaseProps {
  onSubmit: (data: FacilityFormData) => Promise<any>;
  defaultValues?: FacilityFormData;
  isNew?: boolean;
}

function FacilityFormBase({
  onSubmit,
  defaultValues,
  isNew = true,
}: FacilityFormBaseProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FacilityFormData>({
    defaultValues: defaultValues || { name: "", nominalPower: null },
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {isNew ? "Create Facility" : "Update Facility"}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  variant="outlined"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="nominalPower"
              control={control}
              rules={{
                min: {
                  value: 0,
                  message: "Nominal Power must be greater than or equal to 0",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nominal Power"
                  variant="outlined"
                  fullWidth
                  type="number"
                  error={!!errors.nominalPower}
                  helperText={errors.nominalPower?.message}
                  value={field.value === null ? "" : field.value}
                  // slotProps={{ htmlInput: { min: 0 } }}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? null : Number(value));
                  }}
                />
              )}
            />
          </Box>

          <Button type="submit" variant="contained" sx={{ mt: 3 }}>
            {isNew ? "Create Facility" : "Update Facility"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export function CreateFacility() {
  const navigate = useNavigate();

  const [createFacility] = useMutation(CREATE_FACILITY, {
    onCompleted: () => {
      navigate("/");
    },
    onError: (error) => {
      console.error("Error creating facility:", error);
    },
    refetchQueries: ["facilities"],
  });

  function onSubmit(formData: FacilityFormData) {
    return createFacility({ variables: formData });
  }

  return <FacilityFormBase onSubmit={onSubmit} isNew />;
}

export function UpdateFacility() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_FACILITY_NO_REPORTS, {
    variables: { id },
    onCompleted: (data) => {
      if (data?.facility) {
        return data.facility;
      }
    },
  });

  const [updateFacility] = useMutation(UPDATE_FACILITY, {
    onCompleted: () => {
      navigate("/");
    },
    onError: (error) => {
      console.error("Error updating facility:", error);
    },
    refetchQueries: ["facilities"],
  });

  function onSubmit(formData: FacilityFormData) {
    return updateFacility({ variables: { id: id!, ...formData } });
  }

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;
  if (!data.facility)
    return <Typography>Error: Facility does not exist.</Typography>;

  return (
    <FacilityFormBase
      onSubmit={onSubmit}
      defaultValues={data?.facility}
      isNew={false}
    />
  );
}
