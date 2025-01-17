// eslint-disable-next-line no-unused-vars
import React from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import PickJob from "./clockin/PickJob";

export default function ClockIn() {
  const [show, setShow] = React.useState(false);
  const [initials, setInitials] = React.useState("");
  const handleContinue = () => {
    setShow(!show);
  };
  return (
    <Box>
      <Grid container spacing={2} sx={{ width: 800 }}>
        <Grid item md={12}>
          <TextField
            id="employee-initials"
            label="Enter your Initials"
            onChange={(e) => setInitials(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item md={12}>
          <Button
            variant="contained"
            onClick={handleContinue}
            disabled={initials.length < 3}>
            Continue
          </Button>
        </Grid>
        <Grid item md={12}>
          <PickJob show={show} initials={initials} />
        </Grid>
      </Grid>
    </Box>
  );
}
