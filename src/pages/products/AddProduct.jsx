import React from "react";
import {
  Button,
  ButtonGroup,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddProduct(props) {
  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={props.openAddProduct}
      onClose={props.toggleAddProduct}>
      <ToastContainer />
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent>
        <Stack
          spacing={2}
          useFlexGap
          flexWrap="wrap"
          direction="row"
          sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Part Number"
                id="product-part-number"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                id="product-description"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Processes:</Typography>
            </Grid>
            <Grid item xs={6}>
              <FormGroup>
                <FormControlLabel control={<Checkbox />} label="Label" />
                <FormControlLabel control={<Checkbox />} label="Label" />
                <FormControlLabel control={<Checkbox />} label="Label" />
                <FormControlLabel control={<Checkbox />} label="Label" />
              </FormGroup>
            </Grid>
            <Grid item xs={6}>
              <FormGroup>
                <FormControlLabel control={<Checkbox />} label="Label" />
                <FormControlLabel control={<Checkbox />} label="Label" />
                <FormControlLabel control={<Checkbox />} label="Label" />
                <FormControlLabel control={<Checkbox />} label="Label" />
              </FormGroup>
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions>
        <ButtonGroup variant="contained">
          <Button>Save</Button>
          <Button>Cancel</Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
}
