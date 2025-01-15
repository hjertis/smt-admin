import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { allTasks } from "../../data/data";
import { db } from "../../firebase-config";

export default function EditProductDialog(props) {
  const [loading, setLoading] = React.useState(false);
  const [tasks, setTasks] = React.useState(props.tasks || []);
  const productFormRef = React.useRef();
  const partNoRef = React.useRef();
  const descriptionRef = React.useRef();
  const statusRef = React.useRef();

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setTasks(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    console.log(tasks);
  };

  const handleReset = () => {
    productFormRef.current.reset();
    setTasks([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const docRef = await updateDoc(doc(db, "products", props.product.id), {
        partNo: partNoRef.current.value,
        description: descriptionRef.current.value,
        status: statusRef.current.value,
        processes: tasks,
        updated: Timestamp.fromDate(new Date()),
      });
      toast.success("Product successfully updated");
    } catch (err) {
      toast.error("Error creating product" + err.message);
    } finally {
      toast.success("Product successfully updated");
      setLoading(false);
      handleReset();
      props.toggleClose();
    }
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
              disabled={loading}
              defaultValue={props.product.partNo}
              inputRef={partNoRef}
            />
            <TextField
              label="Description"
              id="product-description"
              variant="outlined"
              fullWidth
              required
              disabled={loading}
              inputRef={descriptionRef}
              defaultValue={props.product.description}
            />
            <TextField
              label="Status"
              id="product-status"
              variant="outlined"
              fullWidth
              required
              disabled={loading}
              inputRef={statusRef}
              defaultValue={props.product.status}
            />
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>Processes</InputLabel>
              <Select
                label="Procceses"
                id="product-processes"
                multiple
                fullWidth
                disabled={loading}
                onChange={handleChange}
                MenuProps={MenuProps}
                renderValue={(selected) => selected.join(", ")}
                value={tasks || []}>
                {allTasks.map((task, index) => {
                  return (
                    <MenuItem key={index} value={task}>
                      <Checkbox checked={tasks.includes(task)} />
                      <ListItemText primary={task} />
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
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

EditProductDialog.propTypes = {
  open: PropTypes.bool,
  toggleClose: PropTypes.func,
  product: PropTypes.object,
  tasks: PropTypes.array,
};
