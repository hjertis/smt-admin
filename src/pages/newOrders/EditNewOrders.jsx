import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { deleteDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../../firebase-config";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { allStates } from "../../data/data";

export default function EditNewOrders(props) {
  const [loading, setLoading] = React.useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const newOrderFormRef = React.useRef();
  const orderNumberRef = React.useRef();
  const orderDescriptionRef = React.useRef();
  const orderQuantityRef = React.useRef();
  const orderPartNoRef = React.useRef();
  const orderStartRef = React.useRef();
  const orderEndRef = React.useRef();
  const orderStatusRef = React.useRef();
  const orderStateRef = React.useRef();
  const orderNotesRef = React.useRef();

  const handleNewOrderFormReset = () => {
    newOrderFormRef.current.reset();
    setLoading(false);
  };

  const handleNewOrderCancel = () => {
    handleNewOrderFormReset();
    props.toggleClose();
  };

  const handleDeleteOrder = () => {
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    // eslint-disable-next-line no-unused-vars
    const docRef = await deleteDoc(doc(db, "newOrders", props.order.id));
    toast.success("Order successfully deleted");
    setLoading(false);
    props.toggleClose();
    setOpenConfirmDialog(false);
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
  };

  const handleNewOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // eslint-disable-next-line no-unused-vars
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
        state: orderStateRef.current.value,
        notes: orderNotesRef.current.value,
        updated: Timestamp.fromDate(new Date()),
      });
      toast.success("Order successfully updated");
    } catch (err) {
      toast.error("Error creating order" + err.message);
      console.log(err.message);
    } finally {
      setLoading(false);
      props.toggleClose();
      /* window.location.reload(); */
    }
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.toggleClose}
        maxWidth="md"
        fullWidth>
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
                defaultValue={dayjs(props.order.start.toDate()).format(
                  "DD-MM-YYYY"
                )}
                inputRef={orderStartRef}
              />
              <TextField
                required
                fullWidth
                id="end"
                label="End"
                disabled={loading}
                defaultValue={dayjs(props.order.end.toDate()).format(
                  "DD-MM-YYYY"
                )}
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
                inputRef={orderStatusRef}>
                <MenuItem value={"Finished"}>Finished</MenuItem>
                <MenuItem value={"Started"}>Started</MenuItem>
                <MenuItem value={"Released"}>Released</MenuItem>
                <MenuItem value={"Firm Planned"}>Firm Planned</MenuItem>
              </TextField>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel>State:</InputLabel>
                <Select
                  required
                  fullWidth
                  id="state"
                  label="State"
                  disabled={loading}
                  defaultValue={props.order.state}
                  inputRef={orderStateRef}>
                  {allStates.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <ButtonGroup variant="contained">
            <Button
              type="submit"
              onClick={handleNewOrderSubmit}
              disabled={loading}>
              Save
            </Button>
            <Button onClick={handleNewOrderCancel}>Cancel</Button>
            <Button onClick={handleNewOrderFormReset}>Clear</Button>
            <Button onClick={handleDeleteOrder} color="error">
              Delete
            </Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

EditNewOrders.propTypes = {
  open: PropTypes.bool,
  toggleClose: PropTypes.func,
  order: PropTypes.object,
};
