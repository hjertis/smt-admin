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
import { ToastContainer } from "react-toastify";

export default function ManualAddNewOrder(props) {
  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={props.manualAddOrder}
      onClose={props.toggleManualAddOrder}
    >
      <ToastContainer />
      <DialogTitle>Add New Order</DialogTitle>
      <Stack
        spacing={2}
        useFlexGap
        flexWrap="wrap"
        direction="row"
        sx={{ p: 2 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Order Number"
              id="order-number"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Part Number"
              id="part-number"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              id="description"
              variant="outlined"
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
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Status"
              id="status"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Start Date"
              id="start-date"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="End Date"
              id="end-date"
              variant="outlined"
              fullWidth
            />
          </Grid>
        </Grid>
      </Stack>
      <DialogActions>
        <ButtonGroup variant="contained">
          <Button color="success">Save</Button>
          <Button color="warning">Reset</Button>
          <Button color="error">Cancel</Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
}
