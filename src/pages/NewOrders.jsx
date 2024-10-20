import React from "react";
import { Add } from "@mui/icons-material";
import { Box, Fab, Grid } from "@mui/material";
import AddNewOrderDialog from "./newOrders/AddNewOrderDialog";

const NewOrders = () => {
  const [openNewAddOrder, setOpenNewAddOrder] = React.useState(false);

  const toggleAddNewOrder = () => {
    setOpenNewAddOrder(!openNewAddOrder);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        DataTable will be here
      </Grid>
      <Fab
        color="primary"
        aria-label="add-order"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        onClick={toggleAddNewOrder}>
        <Add />
      </Fab>
      <AddNewOrderDialog
        addOrder={openNewAddOrder}
        toggleAddNewOrder={toggleAddNewOrder}
      />
    </Box>
  );
};

export default NewOrders;
