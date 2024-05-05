import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import React from "react";
import { allTasks } from "../../data/data";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditOrderDialog(props) {
  const [loading, setLoading] = React.useState(false);
  const [orderStartDate, setOrderStartDate] = React.useState(dayjs(new Date()));
  const [orderEndDate, setOrderEndDate] = React.useState(dayjs(new Date()));
  const [subtasks, setSubtasks] = React.useState([]);
  const editOrderFormRef = React.useRef();
  const orderNumberRef = React.useRef();
  const orderDescriptionRef = React.useRef();
  const orderQuantityRef = React.useRef();
  const orderNotesRef = React.useRef();

  const handleEditOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = await updateDoc(
        doc(db, "orders", orderNumberRef.current.value),
        {
          orderNumber: orderNumberRef.current.value,
          orderDescription: orderDescriptionRef.current.value,
          orderQuantity: orderQuantityRef.current.value,
          orderNotes: orderNotesRef.current.value,
          orderStartDate: orderStartDate.$d,
          orderEndDate: orderEndDate.$d,
          status: "Changed",
          subtasks: subtasks.map((task) => {
            return {
              taskName: task,
              taskNumber: subtasks.indexOf(task) + 1,
              status: "Not Started",
              taskStartDate: "01-01-2024",
              taskEndDate: "01-01-2024",
              taskTimeActual: "00:00:00",
              taskTimeEstimated: "00:00:00",
              taskNotes: "",
            };
          }),
        }
      );
      toast.success("Order successfully updafted");
      handleOrderFormReset();
    } catch (err) {
      toast.error("Error updating order" + err.message);
    } finally {
      setLoading(false);
      props.toggleClose();
      window.location.reload();
    }
  };

  const handleOrderFormReset = () => {
    editOrderFormRef.current.reset();
    setLoading(false);
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.toggleClose}
      maxWidth="md"
      fullWidth>
      <ToastContainer />
      <DialogTitle>Edit Order</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
        <form
          noValidate
          onSubmit={handleEditOrderSubmit}
          ref={editOrderFormRef}
          style={{ width: "100%" }}>
          <Stack spacing={2} useFlexGap flexWrap="wrap" direction="row">
            <TextField
              required
              fullWidth
              id="orderNumber"
              label="Order Number"
              name="orderNumber"
              autoComplete="orderNumber"
              disabled={loading}
              inputRef={orderNumberRef}
              defaultValue={props.order.orderNumber}
              sx={{ mt: 1 }}
            />
            <TextField
              required
              fullWidth
              id="orderDescription"
              label="Order Description"
              name="orderDescription"
              autoComplete="orderDescription"
              disabled={loading}
              inputRef={orderDescriptionRef}
              defaultValue={props.order.orderDescription}
            />
            <TextField
              required
              id="orderQuantity"
              label="Order Quantity"
              name="orderQuantity"
              autoComplete="orderQuantity"
              disabled={loading}
              inputRef={orderQuantityRef}
              defaultValue={props.order.orderQuantity}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">pcs</InputAdornment>
                ),
              }}
            />
            <DatePicker
              required
              label="Order Date"
              disabled={loading}
              value={orderStartDate}
              onChange={(newValue) => setOrderStartDate(newValue)}
              sx={{ width: "auto" }}
            />
            <DatePicker
              required
              label="Delivery Date"
              disabled={loading}
              value={orderEndDate}
              onChange={(newValue) => setOrderEndDate(newValue)}
              sx={{ width: "auto" }}
            />
            <Autocomplete
              multiple
              fullWidth
              required
              disableCloseOnSelect
              freeSolo
              id="subtasks"
              options={allTasks}
              disabled={loading}
              onChange={(event, newValue) => {
                setSubtasks(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Subtasks"
                  placeholder="Subtasks"
                />
              )}
            />
            <TextField
              multiline
              fullWidth
              id="orderNotes"
              label="Notes"
              name="orderNotes"
              disabled={loading}
              inputRef={orderNotesRef}
              defaultValue={props.order.orderNotes}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <ButtonGroup variant="contained">
          <Button type="submit" onClick={handleEditOrderSubmit}>
            Save
          </Button>
          <Button onClick={props.toggleClose}>Cancel</Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
}
