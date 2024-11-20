import React from "react";
import { Add } from "@mui/icons-material";
import { Box, Button, ButtonGroup, Fab, Grid, TextField } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { columns } from "./newOrders/columns.jsx";
import ImportOrdersDialog from "./newOrders/ImportOrdersDialog.jsx";
import ManualAddNewOrder from "./newOrders/ManualAddNewOrder.jsx";

const NewOrders = () => {
  const [openImportOrders, setOpenImportOrders] = React.useState(false);
  const [openManualAddOrder, setOpenManualAddOrder] = React.useState(false);
  const [documents, setDocuments] = React.useState([]);
  const database = collection(db, "newOrders");

  React.useEffect(() => {
    const getDocuments = async () => {
      const querySnapshot = await getDocs(database);
      setDocuments(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    };
    getDocuments();
  }, []);

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
            rows={documents}
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
