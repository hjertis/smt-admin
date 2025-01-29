// eslint-disable-next-line no-unused-vars
import React from "react";
import { Autocomplete, Box, Button, Grid, TextField } from "@mui/material";
import PickJob from "./clockin/PickJob";
import useFirebase from "../hooks/useFirebase";

export default function ClockIn() {
  const [show, setShow] = React.useState(false);
  const [currentInitials, setCurrentInitials] = React.useState("");
  const { data } = useFirebase("employees");
  const initials = data.map((employee) => employee.initials);
  const handleContinue = () => {
    setShow(!show);
  };
  return (
    <Box>
      <Grid container spacing={2} sx={{ width: 800 }}>
        <Grid item md={12}>
          <Autocomplete
            disablePortal
            id="employee-initials"
            label="Enter your Initials"
            options={initials}
            fullWidth
            onChange={(event, newValue) => setCurrentInitials(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid item md={12}>
          <Button
            variant="contained"
            onClick={handleContinue}
            disabled={currentInitials.length < 3}>
            Continue
          </Button>
        </Grid>
        <Grid item md={12}>
          <PickJob show={show} initials={currentInitials} />
        </Grid>
      </Grid>
    </Box>
  );
}
