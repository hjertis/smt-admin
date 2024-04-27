import React from "react";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useStopwatch } from "react-timer-hook";

export default function SetupDialog(props) {
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch();

  return (
    <Dialog maxWidth="md" fullWidth open={props.open} onClose={props.toggle}>
      <DialogTitle>Start/Stop Setup</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {hours}:{minutes}:{seconds}
          <br />
          {isRunning ? "Running" : "Not Running"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <ButtonGroup variant="contained">
          <Button onClick={start}>Start</Button>
          <Button onClick={pause}>Pause</Button>
          <Button>Back</Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
}
