import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../../firebase-config";
import dayjs from "dayjs";

export default function EditNewOrders(props) {
  const newOrderFormRef = React.useRef();
  const orderNumberRef = React.useRef();
  const orderDescriptionRef = React.useRef();
  const orderQuantityRef = React.useRef();
  const orderPartNoRef = React.useRef();
  const orderStartRef = React.useRef();
  const orderEndRef = React.useRef();
  const orderStatusRef = React.useRef();
  const orderNotesRef = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const editOrderFormRef = React.useRef();

  const handleNewOrderFormReset = () => {
    newOrderFormRef.current.reset();
    setLoading(false);
  };

  const handleNewOrderCancel = () => {
    handleNewOrderFormReset();
    props.toggleClose();
  };

  const handleNewOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = await updateDoc(doc(db, "newOrders", props.order.id), {
        orderNumber: orderNumberRef.current.value,
        description: orderDescriptionRef.current.value,
        partNo: orderPartNoRef.current.value,
        quantity: orderQuantityRef.current.value,
        start: Timestamp.fromDate(
          dayjs(orderStartRef.current.value, "DD-MM-YYYY").toDate()
        ),
        end: Timestamp.fromDate(
          dayjs(orderEndRef.current.value, "DD-MM-YYYY").toDate()
        ),
        status: orderStatusRef.current.value,
        notes: orderNotesRef.current.value,
        updated: Date.now().toString(),
      });
      toast.success("Order successfully updated");
    } catch (err) {
      toast.error("Error creating order" + err.message);
      console.log(err.message);
    } finally {
      setLoading(false);
      props.toggleClose();
      window.location.reload();
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.toggleClose}
      maxWidth="md"
      fullWidth
    >
      <ToastContainer />
      <DialogTitle>Edit order</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
        <form noValidate ref={newOrderFormRef} style={{ width: "100%" }}>
          <Stack spacing={2} useFlexGap flexWrap="wrap" direction="row">
            <TextField
              required
              fullWidth
              id="order-number"
              label="Order Number"
              disabled={loading}
              defaultValue={props.order.orderNumber}
              inputRef={orderNumberRef}
              sx={{ mt: 1 }}
            />
            <TextField
              required
              fullWidth
              id="order-description"
              label="Description"
              disabled={loading}
              defaultValue={props.order.description}
              inputRef={orderDescriptionRef}
            />
            <TextField
              required
              fullWidth
              id="part-number"
              label="Part Number"
              disabled={loading}
              defaultValue={props.order.partNo}
              inputRef={orderPartNoRef}
            />
            <TextField
              required
              fullWidth
              id="quantity"
              label="Quantity"
              disabled={loading}
              defaultValue={props.order.quantity}
              inputRef={orderQuantityRef}
            />
            <TextField
              required
              fullWidth
              id="start"
              label="Start"
              disabled={loading}
              defaultValue={props.order.start
                .toDate()
                .toISOString()
                .slice(0, 10)}
              inputRef={orderStartRef}
            />
            <TextField
              required
              fullWidth
              id="end"
              label="End"
              disabled={loading}
              defaultValue={props.order.end.toDate().toISOString().slice(0, 10)}
              inputRef={orderEndRef}
            />
            <TextField
              fullWidth
              multiline
              id="notes"
              label="Notes"
              disabled={loading}
              defaultValue={props.order.notes}
              inputRef={orderNotesRef}
            />
            <TextField
              required
              select
              fullWidth
              id="status"
              label="Status"
              disabled={loading}
              defaultValue={props.order.status}
              inputRef={orderStatusRef}
            >
              <MenuItem value={"Finished"}>Finished</MenuItem>
              <MenuItem value={"Started"}>Started</MenuItem>
              <MenuItem value={"Released"}>Released</MenuItem>
              <MenuItem value={"Firm Planned"}>Firm Planned</MenuItem>
            </TextField>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <ButtonGroup variant="contained">
          <Button
            type="submit"
            onClick={handleNewOrderSubmit}
            disabled={loading}
          >
            Save
          </Button>
          <Button onClick={handleNewOrderCancel}>Cancel</Button>
          <Button onClick={handleNewOrderFormReset}>Clear</Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
}
