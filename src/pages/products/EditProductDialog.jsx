import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Timestamp } from "firebase/firestore";
import React from "react";
import { ToastContainer } from "react-toastify";

export default function EditProductDialog(props) {
  const productFormRef = React.useRef();
  const partNoRef = React.useRef();

  return (
    <Dialog
      open={props.open}
      onClose={props.toggleClose}
      maxWidth="md"
      fullWidth>
      <ToastContainer />
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
        <form noValidate ref={productFormRef} style={{ width: "100%" }}>
          <Stack
            spacing={2}
            useFlexGap
            flexWrap="wrap"
            direction="row"
            sx={{ p: 2 }}>
            <TextField
              label="Part Number"
              id="product-part-number"
              variant="outlined"
              fullWidth
              required
              defaultValue={props.product.partNo}
              inputRef={partNoRef}
            />
            <TextField
              label="Description"
              id="product-description"
              variant="outlined"
              fullWidth
              required
              defaultValue={props.product.description}
            />
            <TextField
              label="Status"
              id="product-status"
              variant="outlined"
              fullWidth
              required
              defaultValue={props.product.status}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ height: "40px", overflow: "hidden" }}>
              Last updated:{" "}
              {Timestamp.fromDate(props.product.updated.toDate())
                .toDate()
                .toDateString()}
            </Typography>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <button>Save</button>
      </DialogActions>
    </Dialog>
  );
}
