import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
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
              sx={{ mt: 2 }}
            />
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
}
