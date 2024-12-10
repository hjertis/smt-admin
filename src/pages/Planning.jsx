import React from "react";
import { Box, Grid } from "@mui/material";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DragAndDropCalendarPage from "./planning/DragAndDropCalendar.jsx";
import useFirebase from "../hooks/useFirebase.jsx";

export default function Planning(props) {
  const { data, error, loading } = useFirebase("newOrders");

  moment.updateLocale("da", {
    week: {
      dow: 1,
    },
  });

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item>
          <h1>Planning</h1>
        </Grid>
      </Grid>
      <DragAndDropCalendarPage
        localizer={momentLocalizer(moment)}
        documents={data}
      />
    </Box>
  );
}
