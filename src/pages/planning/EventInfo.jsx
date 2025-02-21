import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import React from "react";
import { db } from "../../firebase-config";
import { ToastContainer, toast } from "react-toastify";
import PropTypes from "prop-types";
import { allStates } from "../../data/data";

export default function EditEvent(props) {
  const data = props.currentEvent;
  const [loading, setLoading] = React.useState(false);
  const partNoRef = React.useRef();
  const orderNoRef = React.useRef();
  const descriptionRef = React.useRef();
  const quantityRef = React.useRef();
  const stateRef = React.useRef();
  const statusRef = React.useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const docRef = await updateDoc(doc(db, "newOrders", data.id), {
        orderNo: orderNoRef.current.value,
        partNo: partNoRef.current.value,
        description: descriptionRef.current.value,
        quantity: quantityRef.current.value,
        state: stateRef.current.value,
        status: statusRef.current.value,
        updated: Timestamp.fromDate(new Date()),
      });
      toast.success("Orders successfully updated");
    } catch (err) {
      toast.error("Error creating order" + err.message);
      console.log(err.message);
    } finally {
      setLoading(false);
      props.handleClose();
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      maxWidth="md"
      fullWidth>
      <ToastContainer />
      <DialogTitle>{data && data.title}</DialogTitle>
      <DialogContent>
        {data && (
          <>
            <TextField
              id="orderNo"
              label="Order No"
              variant="outlined"
              defaultValue={data.orderNo}
              fullWidth
              inputRef={orderNoRef}
              disabled={loading}
              sx={{ mt: 2 }}
            />
            <TextField
              id="partNo"
              label="Part No"
              variant="outlined"
              defaultValue={data.partNo}
              fullWidth
              inputRef={partNoRef}
              disabled={loading}
              sx={{ mt: 2 }}
            />
            <TextField
              id="description"
              label="Description"
              variant="outlined"
              defaultValue={data.description}
              fullWidth
              inputRef={descriptionRef}
              disabled={loading}
              multiline
              rows={2}
              sx={{ mt: 2 }}
            />
            <TextField
              id="quantity"
              label="Quantity"
              variant="outlined"
              defaultValue={data.quantity}
              fullWidth
              inputRef={quantityRef}
              disabled={loading}
              sx={{ mt: 2 }}
            />
            <FormControl sx={{ width: "100%", mt: 2 }}>
              <InputLabel>State:</InputLabel>
              <Select
                required
                fullWidth
                id="state"
                label="State"
                disabled={loading}
                defaultValue={data.state}
                inputRef={stateRef}>
                {allStates.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              id="status"
              label="Status"
              variant="outlined"
              defaultValue={data.status}
              fullWidth
              inputRef={statusRef}
              disabled={loading}
              sx={{ mt: 2 }}
            />
            <TextField
              id="start"
              label="Start"
              variant="outlined"
              defaultValue={data.start.toISOString().slice(0, 10)}
              disabled
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              id="end"
              label="End"
              variant="outlined"
              defaultValue={data.end.toISOString().slice(0, 10)}
              disabled
              fullWidth
              sx={{ mt: 2 }}
            />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Last updated: {data.updated.toISOString().slice(0, 10)}
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <ButtonGroup variant="contained">
          <Button color="success" onClick={handleSubmit}>
            Update
          </Button>
          <Button color="error" onClick={props.handleClose}>
            Close
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
}

EditEvent.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  currentEvent: PropTypes.object,
};
