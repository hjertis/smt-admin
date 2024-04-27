import {
  Autocomplete,
  Box,
  Dialog,
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

  const handleEditOrderSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.toggleClose}
      maxWidth="md"
      fullWidth>
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
    </Dialog>
  );
}
