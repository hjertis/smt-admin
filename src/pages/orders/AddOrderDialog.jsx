import React from "react";
import {
  Autocomplete,
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
import { allTasks } from "../../data/data";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddOrderDialog(props) {
  const addOrderFormRef = React.useRef();
  const orderNumberRef = React.useRef();
  const orderDescriptionRef = React.useRef();
  const orderQuantityRef = React.useRef();
  const orderNotesRef = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const [orderStartDate, setOrderStartDate] = React.useState(dayjs(new Date()));
  const [orderEndDate, setOrderEndDate] = React.useState(dayjs(new Date()));
  const [subtasks, setSubtasks] = React.useState([]);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = await setDoc(
        doc(db, "orders", orderNumberRef.current.value),
        {
          orderNumber: orderNumberRef.current.value,
          orderDescription: orderDescriptionRef.current.value,
          orderQuantity: orderQuantityRef.current.value,
          orderNotes: orderNotesRef.current.value,
          orderStartDate: orderStartDate.$d,
          orderEndDate: orderEndDate.$d,
          status: "New",
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
      toast.success("Order added successfully");
      handleOrderFormReset();
    } catch (err) {
      toast.error("Error creating order" + err.message);
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderFormReset = () => {
    addOrderFormRef.current.reset();
    setLoading(false);
  };

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={props.addOrder}
      onClose={props.toggleAddOrder}>
      <ToastContainer />
      <DialogTitle>Add Order</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
        <form
          noValidate
          onSubmit={handleOrderSubmit}
          ref={addOrderFormRef}
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
              sx={{ mt: 1 }}
            />
            <TextField
              required
              fullWidth
              id="orderDescription"
              label="Description"
              name="orderDescription"
              autoComplete="orderDescription"
              disabled={loading}
              inputRef={orderDescriptionRef}
            />
            <TextField
              required
              id="orderQuantity"
              label="Quantity"
              name="orderQuantity"
              autoComplete="orderQuantity"
              disabled={loading}
              inputRef={orderQuantityRef}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">pcs</InputAdornment>
                ),
              }}
            />
            <DatePicker
              label="Order Date"
              disabled={loading}
              value={orderStartDate}
              onChange={(newValue) => setOrderStartDate(newValue)}
              sx={{ width: "auto" }}
            />
            <DatePicker
              label="Delivery Date"
              disabled={loading}
              value={orderEndDate}
              onChange={(newValue) => setOrderEndDate(newValue)}
              sx={{ width: "auto" }}
            />
            <Autocomplete
              multiple
              fullWidth
              disableCloseOnSelect
              freeSolo
              id="subtasks"
              options={allTasks}
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
            />
          </Stack>
          <DialogActions>
            <ButtonGroup variant="contained">
              <Button color="success" onClick={handleOrderSubmit}>
                Add Order
              </Button>
              <Button color="warning" onClick={(e) => handleOrderFormReset()}>
                Reset
              </Button>
              <Button color="error" onClick={(e) => props.toggleAddOrder()}>
                Cancel
              </Button>
            </ButtonGroup>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
