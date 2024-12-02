import React from "react";
import { Box, Grid } from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

export default function Planning(props) {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item>
          <h1>Planning</h1>
        </Grid>
      </Grid>
      <Calendar
        localizer={momentLocalizer(moment)}
        events={[]}
        startAccessor={"start"}
        endAccessor={"end"}
        style={{ height: 500 }}
      />
    </Box>
  );
}
