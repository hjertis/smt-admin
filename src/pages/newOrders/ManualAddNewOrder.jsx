import React from "react";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { db } from "../../firebase-config";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import dayjs from "dayjs";

export default function ManualAddNewOrder(props) {
  const [loading, setLoading] = React.useState(false);
  const orderNumberRef = React.useRef();
  const descriptionRef = React.useRef();
  const partNumberRef = React.useRef();
  const quantityRef = React.useRef();
  const statusRef = React.useRef();
  const orderStartDateRef = React.useRef();
  const orderEndDateRef = React.useRef();

  const handleOrderReset = () => {
    orderNumberRef.current.value = "";
    descriptionRef.current.value = "";
    partNumberRef.current.value = "";
    quantityRef.current.value = "";
    statusRef.current.value = "";
    orderStartDateRef.current.value = "";
    orderEndDateRef.current.value = "";
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = doc(db, "newOrders", orderNumberRef.current.value);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          orderNumber: orderNumberRef.current.value,
          description: descriptionRef.current.value,
          partNo: partNumberRef.current.value,
          quantity: quantityRef.current.value,
          start: Timestamp.fromDate(
            dayjs(orderStartDateRef.current.value, "DD-MM-YYYY").toDate()
          ),
          end: Timestamp.fromDate(
            dayjs(orderEndDateRef.current.value, "DD-MM-YYYY").toDate()
          ),
          status: statusRef.current.value,
          updated: Timestamp.fromDate(new Date()),
        });
      } else {
        return;
      }
    } catch (err) {
      console.log(err);
      toast.error("Error creating order" + err.message);
    } finally {
      setLoading(false);
      toast.success("Order added successfully");
    }
  };

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={props.manualAddOrder}
      onClose={props.toggleManualAddOrder}>
      <ToastContainer />
      <DialogTitle>Add New Order</DialogTitle>
      <Stack
        spacing={2}
        useFlexGap
        flexWrap="wrap"
        direction="row"
        sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Order Number"
              id="order-number"
              variant="outlined"
              inputRef={orderNumberRef}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Part Number"
              id="part-number"
              variant="outlined"
              inputRef={partNumberRef}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              id="description"
              variant="outlined"
              inputRef={descriptionRef}
              multiline
              rows={2}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Quantity"
              id="quantity"
              variant="outlined"
              inputRef={quantityRef}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Status"
              id="status"
              variant="outlined"
              inputRef={statusRef}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Start Date"
              id="start-date"
              variant="outlined"
              inputRef={orderStartDateRef}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="End Date"
              id="end-date"
              variant="outlined"
              inputRef={orderEndDateRef}
              fullWidth
            />
          </Grid>
        </Grid>
      </Stack>
      <DialogActions>
        <ButtonGroup variant="contained">
          <Button color="success" onClick={handleSubmitOrder}>
            Save
          </Button>
          <Button color="warning">Reset</Button>
          <Button color="error" onClick={props.toggleManualAddOrder}>
            Cancel
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
}
