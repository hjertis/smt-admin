import React from "react";
import {
  Button,
  ButtonGroup,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { allTasks } from "../../data/data";
import PropTypes from "prop-types";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";

export default function AddProduct(props) {
  const [tasks, setTasks] = React.useState([]);
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
    setTasks(typeof value === "string" ? value.split(",") : value);
  };

  const handleReset = () => {
    productFormRef.current.reset();
    setTasks([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // eslint-disable-next-line no-unused-vars
      const docRef = await updateDoc(
        doc(db, "products", partNoRef.current.value),
        {
          partNo: partNoRef.current.value,
          description: descriptionRef.current.value,
          status: statusRef.current.value,
          processes: tasks,
          updated: Timestamp.fromDate(new Date()),
        }
      );
    } catch (err) {
      toast.error("Error creating product" + err.message);
      console.log(err.message);
    } finally {
      toast.success("Product successfully updated");
      handleReset();
      props.toggleAddProduct();
    }
  };

  const handleClose = () => {
    handleReset();
    props.toggleAddProduct();
  };

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={props.openAddProduct}
      onClose={handleClose}>
      <ToastContainer />
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent>
        <Stack
          spacing={2}
          useFlexGap
          flexWrap="wrap"
          direction="row"
          sx={{ p: 2 }}>
          <form noValidate ref={productFormRef} style={{ width: "100%" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Part Number"
                  id="product-part-number"
                  variant="outlined"
                  fullWidth
                  inputRef={partNoRef}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  id="product-description"
                  variant="outlined"
                  fullWidth
                  inputRef={descriptionRef}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Status"
                  id="product-status"
                  variant="outlined"
                  fullWidth
                  inputRef={statusRef}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel>Processes</InputLabel>
                  <Select
                    id="product-processes"
                    label="Processes"
                    variant="outlined"
                    fullWidth
                    defaultValue={"Process 1"}
                    onChange={handleChange}
                    value={tasks || []}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                    multiple>
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
              </Grid>
            </Grid>
          </form>
        </Stack>
      </DialogContent>
      <DialogActions>
        <ButtonGroup variant="contained">
          <Button color="success" onClick={handleSubmit}>
            Save
          </Button>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
}

AddProduct.propTypes = {
  openAddProduct: PropTypes.bool,
  toggleAddProduct: PropTypes.func,
};
