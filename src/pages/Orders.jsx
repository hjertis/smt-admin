import { Box, Fab, Grid, Typography } from "@mui/material";
import React from "react";
import DataTable from "./orders/DataTable";
import { Add } from "@mui/icons-material";
import AddOrderDialog from "./orders/AddOrderDialog";

export default function Orders() {
  const [openAddOrder, setOpenAddOrder] = React.useState(false);

  const toggleAddOrder = () => {
    setOpenAddOrder(!openAddOrder);
  };
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item>
          <DataTable />
        </Grid>
      </Grid>
      <Fab
        color="primary"
        aria-label="add-order"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        onClick={toggleAddOrder}>
        <Add />
      </Fab>
      <AddOrderDialog addOrder={openAddOrder} toggleAddOrder={toggleAddOrder} />
    </Box>
  );
}
