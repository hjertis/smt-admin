import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export default function ImportProducts(props) {
  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={props.openImportProducts}
      onClose={props.toggleImportProducts}>
      <DialogTitle>Import Products</DialogTitle>
      <DialogContent></DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
}
