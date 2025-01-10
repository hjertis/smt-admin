import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

export default function EditEvent(
  props,
  open,
  handleClose,
  currentEvent,
  onDeleteEvent
) {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Event Information</DialogTitle>
      <DialogContent>
        <DialogContentText>text</DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
