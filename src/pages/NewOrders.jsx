import React from "react";
import { Add } from "@mui/icons-material";
import { Box, Fab, Grid } from "@mui/material";
import AddNewOrderDialog from "./newOrders/AddNewOrderDialog";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { DataGrid } from "@mui/x-data-grid";

const NewOrders = () => {
  const [openNewAddOrder, setOpenNewAddOrder] = React.useState(false);
  const [documents, setDocuments] = React.useState();
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

  const toggleAddNewOrder = () => {
    setOpenNewAddOrder(!openNewAddOrder);
  };

  return (
    <Box>
      <Grid container spacing={2}></Grid>
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
