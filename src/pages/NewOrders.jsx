import React from "react";
import { Add } from "@mui/icons-material";
import { Box, Fab, Grid } from "@mui/material";
import AddNewOrderDialog from "./newOrders/AddNewOrderDialog";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { DataGrid } from "@mui/x-data-grid";

const NewOrders = () => {
  const [openNewAddOrder, setOpenNewAddOrder] = React.useState(false);
  const [documents, setDocuments] = React.useState([]);
  const database = collection(db, "newOrders");
  const data = [];

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

  console.log(documents);

  const columns = [
    {
      field: "orderNumber",
      headerName: "Order Number",
      width: 150,
      flex: 0.75,
    },
    { field: "description", headerName: "Description", width: 150, flex: 2 },
    { field: "partNo", headerName: "Part No", width: 150, flex: 0.75 },
    { field: "quantity", headerName: "Quantity", width: 150, flex: 0.5 },
    { field: "start", headerName: "Start", width: 150, flex: 1 },
    { field: "end", headerName: "End", width: 150, flex: 1 },
  ];

  const toggleAddNewOrder = () => {
    setOpenNewAddOrder(!openNewAddOrder);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <DataGrid rows={documents} columns={columns} sx={{ width: "75vw" }} />
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
