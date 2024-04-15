import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import DataGrid from "./orders/DataGrid";

export default function Orders() {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item>Hello Cards</Grid>
        <Grid item>
          <DataGrid />
        </Grid>
      </Grid>
    </Box>
  );
}
