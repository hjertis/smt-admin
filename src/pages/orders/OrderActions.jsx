import {
  Autocomplete,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { db } from "../../firebase-config";

export default function OrderActions(props) {
  const notesRef = React.useRef();
  const [currentOrder, setCurrentOrder] = React.useState(props.order);
  const [employee, setEmployee] = React.useState("");
  const options = [];

  const addTime = async () => {
    try {
      const docRef = await setDoc(
        doc(db, "orders", currentOrder.orderNumber),
        {
          [currentOrder.status]: {
            status: "Started",
            startTime: Date.now(),
            worker: employee,
          },
        },
        { merge: true }
      );
    } catch (err) {
      console.log(err.message);
    } finally {
      props.toggle();
      window.location.reload();
    }
  };

  const stopTime = async () => {
    try {
      const docRef = await setDoc(
        doc(db, "orders", currentOrder.orderNumber),
        {
          [currentOrder.status]: {
            status: "Stopped",
            stopTime: Date.now(),
          },
        },
        { merge: true }
      );
    } catch (err) {
      console.log(err.message);
    } finally {
      props.toggle();
      window.location.reload();
    }
  };

  props.employees.forEach((employee) => {
    options.push(employee.firstName + " " + employee.lastName);
  });

  return (
    <Dialog open={props.open} onClose={props.toggle} maxWidth="md" fullWidth>
      <DialogTitle>Order Actions</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Actions for order {currentOrder.orderNumber} -{" "}
          {currentOrder.orderDescription}
        </DialogContentText>
        {currentOrder.status === "New" && (
          <Typography>Please update status to something else</Typography>
        )}
        {currentOrder.status !== "New" && (
          <Stack spacing={2}>
            <Autocomplete
              fullWidth
              id="employees"
              options={options} //TODO: change employees to an array of employees
              onChange={(event, newValue) => {
                setEmployee(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Employee"
                  placeholder="Select employee"
                />
              )}
              sx={{ pt: 1 }}
            />
            <TextField
              fullWidth
              id="notes"
              label="Notes"
              name="notes"
              inputRef={notesRef}
            />
            <DialogActions>
              <ButtonGroup variant="contained">
                <Button onClick={addTime}>
                  Start time for {currentOrder.status}
                </Button>
                <Button onClick={stopTime}>
                  Stop time for {currentOrder.status}
                </Button>
                <Button color="error" onClick={props.toggle}>
                  Cancel
                </Button>
              </ButtonGroup>
            </DialogActions>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
