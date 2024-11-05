import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditNewOrders(props) {
  const [loading, setLoading] = React.useState(false);
  const editOrderFormRef = React.useRef();
  const orderNumberRef = React.useRef();
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
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
          }}
          ref={editOrderFormRef}
          style={{ width: "100%" }}
        >
          <Stack spacing={2} useFlexGap flexWrap="wrap" direction="row">
            <TextField
              required
              fullWidth
              id="order-number"
              label="Order Number"
              disabled={loading}
              inputRef={orderNumberRef}
              defaultValue={props.order.orderNumber}
              sx={{ mt: 1 }}
            />
            <TextField
              required
              fullWidth
              id="order-description"
              label="Description"
              disabled={loading}
              defaultValue={props.order.description}
            />
            <TextField
              required
              fullWidth
              id="part-number"
              label="Part Number"
              disabled={loading}
              defaultValue={props.order.partNo}
            />
            <TextField
              required
              fullWidth
              id="quantity"
              label="Quantity"
              disabled={loading}
              defaultValue={props.order.quantity}
            />
            <TextField
              required
              fullWidth
              id="start"
              label="Start"
              disabled={loading}
              defaultValue={props.order.start}
            />
            <TextField
              required
              fullWidth
              id="end"
              label="End"
              disabled={loading}
              defaultValue={props.order.end}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <ButtonGroup variant="contained">
          <Button type="submit" onClick={() => {}} disabled={loading}>
            Save
          </Button>
          <Button>Cancel</Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
}
