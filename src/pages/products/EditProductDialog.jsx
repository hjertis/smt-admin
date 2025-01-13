import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import React from "react";
import { ToastContainer } from "react-toastify";
import { allTasks } from "../../data/data";
import { db } from "../../firebase-config";

export default function EditProductDialog(props) {
  const [loading, setLoading] = React.useState(false);
  const [tasks, setTasks] = React.useState([]);
  const productFormRef = React.useRef();
  const partNoRef = React.useRef();

  const handleChange = (event) => {
    const value = event;
    setTasks(typeof value === "string" ? value.split(",") : value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = await updateDoc(doc(db, "products", props.product.id), {
        partNo: partNoRef.current.value,
        description: productFormRef.current[1].value,
        status: productFormRef.current[2].value,
        processes: productFormRef.current[3].value,
        updated: Timestamp.fromDate(new Date()),
      });
      toast.success("Product successfully updated");
    } catch (err) {
      toast.error("Error creating product" + err.message);
    }
    setLoading(false);
    props.toggleClose();
  };

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
            <Select
              label="Procceses"
              id="product-processes"
              multiple
              fullWidth
              onChange={handleChange}
              value={props.product.procsses || []}>
              {allTasks.map((task, index) => {
                return (
                  <MenuItem key={index} value={task}>
                    <Checkbox checked={tasks.includes(task)} />
                    <ListItemText primary={task} />
                  </MenuItem>
                );
              })}
            </Select>
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
        <Button onClick={handleSubmit}>Save</Button>
        <Button onClick={props.toggleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
