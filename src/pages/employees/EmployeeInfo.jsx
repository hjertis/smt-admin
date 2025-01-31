//eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import Punchclock from "./Punchclock";

export default function EmployeeInfo(props) {
  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={props.open}
      onClose={props.toggleClose}>
      <DialogTitle>
        {props.data.firstName} {props.data.lastName} - {props.data.id}
      </DialogTitle>
      <DialogContent>
        <p>
          Time Resource: {props.data.timeResource}
          <br />
          Effectiveness: {props.data.effectiveness}
        </p>
        <Typography variant="h6">Punchclock Entries</Typography>
        <Punchclock employeeId={props.data.id} />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.toggleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

EmployeeInfo.propTypes = {
  props: PropTypes.any,
  data: PropTypes.any,
  open: PropTypes.bool,
  toggleClose: PropTypes.func,
};
