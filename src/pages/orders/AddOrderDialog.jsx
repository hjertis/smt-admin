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

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
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
              <Button type="submit" color="success">
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
