import React from "react";
import { Add } from "@mui/icons-material";
import { Box, Button, ButtonGroup, Fab, Grid, TextField } from "@mui/material";
import AddNewOrderDialog from "./newOrders/AddNewOrderDialog";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { columns } from "./newOrders/columns.jsx";

const NewOrders = () => {
  const [openNewAddOrder, setOpenNewAddOrder] = React.useState(false);
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

  const toggleAddNewOrder = () => {
    setOpenNewAddOrder(!openNewAddOrder);
  };

  const toggleManualAddOrder = () => {};

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item>
          <ButtonGroup variant="contained">
            <Button onClick={toggleManualAddOrder}>Add New Order</Button>
            <Button onClick={toggleAddNewOrder}>Import CSV</Button>
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
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
          />
        </Grid>
      </Grid>
      <Fab
        color="primary"
        aria-label="add-order"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        onClick={toggleAddNewOrder}
      >
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
