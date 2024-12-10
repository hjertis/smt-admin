import React from "react";
import { Box, Button, ButtonGroup, Grid } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { columns } from "./newOrders/columns.jsx";
import ImportOrdersDialog from "./newOrders/ImportOrdersDialog.jsx";
import ManualAddNewOrder from "./newOrders/ManualAddNewOrder.jsx";
import useFirebase from "../hooks/useFirebase.jsx";

const NewOrders = () => {
  const [openImportOrders, setOpenImportOrders] = React.useState(false);
  const [openManualAddOrder, setOpenManualAddOrder] = React.useState(false);
  const { data, error, loading } = useFirebase("newOrders");

  const toggleImportOrders = () => {
    setOpenImportOrders(!openImportOrders);
  };

  const toggleManualAddOrder = () => {
    setOpenManualAddOrder(!openManualAddOrder);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item>
          <ButtonGroup variant="contained">
            <Button onClick={toggleManualAddOrder}>Add New Order</Button>
            <Button onClick={toggleImportOrders}>Import CSV</Button>
          </ButtonGroup>
        </Grid>
        <Grid item>
          <DataGrid
            rows={data}
            columns={columns}
            sx={{ width: "75vw", minHeight: "300px" }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            initialState={{
              filter: {
                filterModel: {
                  items: [
                    {
                      field: "status",
                      operator: "doesNotContain",
                      value: "Finished",
                    },
                  ],
                },
              },
            }}
            disableColumnSelector
            disableDensitySelector
            disableRowSelectionOnClick
          />
        </Grid>
      </Grid>
      <ImportOrdersDialog
        addOrder={openImportOrders}
        toggleImportOrders={toggleImportOrders}
      />
      <ManualAddNewOrder
        manualAddOrder={openManualAddOrder}
        toggleManualAddOrder={toggleManualAddOrder}
      />
    </Box>
  );
};

export default NewOrders;
