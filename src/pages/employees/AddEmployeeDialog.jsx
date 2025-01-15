import React from "react";
import {
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
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import PropTypes from "prop-types";

export default function AddEmployeeDialog(props) {
  const addEmployeeFormRef = React.useRef();
  const firstNameRef = React.useRef();
  const lastNameRef = React.useRef();
  const timeResourceRef = React.useRef();
  const effectivenessRef = React.useRef();
  const [loading, setLoading] = React.useState(false);

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const docRef = await setDoc(
        doc(
          db,
          "employees",
          firstNameRef.current.value + " " + lastNameRef.current.value
        ),
        {
          firstName: firstNameRef.current.value,
          lastName: lastNameRef.current.value,
          timeResource: timeResourceRef.current.value,
          effectiveness: effectivenessRef.current.value,
        }
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      props.toggleAddEmployee();
      window.location.reload();
    }
  };
  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={props.addEmployee}
      onClose={props.toggleAddEmployee}>
      <DialogTitle>Add Employee</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
        <form
          noValidate
          onSubmit={handleEmployeeSubmit}
          ref={addEmployeeFormRef}
          style={{ width: "100%" }}>
          <Stack spacing={2} useFlexGap flexWrap="wrap" direction="row">
            <TextField
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              autoComplete="firstName"
              disabled={loading}
              inputRef={firstNameRef}
              sx={{ mt: 1 }}
            />
            <TextField
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="lastName"
              disabled={loading}
              inputRef={lastNameRef}
            />
            <TextField
              required
              fullWidth
              id="timeResource"
              label="Time Available"
              name="timeResource"
              autoComplete="timeResource"
              disabled={loading}
              inputRef={timeResourceRef}
              defaultValue={"480"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">minutes</InputAdornment>
                ),
              }}
            />
            <TextField
              required
              fullWidth
              id="effectiveness"
              label="Effectiveness"
              name="effectiveness"
              autoComplete="effectiveness"
              defaultValue={"0.8"}
              disabled={loading}
              inputRef={effectivenessRef}
            />
            <DialogActions>
              <ButtonGroup variant="contained">
                <Button onClick={handleEmployeeSubmit}>Save Employee</Button>
                <Button onClick={props.toggleAddEmployee}>Cancel</Button>
              </ButtonGroup>
            </DialogActions>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
}

AddEmployeeDialog.propTypes = {
  addEmployee: PropTypes.bool,
  toggleAddEmployee: PropTypes.func,
};
