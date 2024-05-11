import React from "react";
import {
  Autocomplete,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { Adjust } from "@mui/icons-material";
import { allTasks } from "../../../data/data";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";

export default function ChangeStatus(props) {
  const [openStatus, setOpenStatus] = React.useState(false);
  const [currentOrder, setCurrentOrder] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [newStatus, setNewStatus] = React.useState();
  const [statusOptions, setStatusOptions] = React.useState(allTasks);
  const toggleStatus = () => {
    setOpenStatus(!openStatus);
  };
  const handleOpen = () => {
    setOpenStatus(true);
    setCurrentOrder(props.order);
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = await updateDoc(
        doc(db, "orders", currentOrder.orderNumber),
        {
          status: newStatus,
        }
      );
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
      toggleStatus();
      window.location.reload();
    }
  };

  return (
    <div>
      <IconButton onClick={handleOpen}>
        <Adjust />
      </IconButton>
      <Dialog open={openStatus} onClose={toggleStatus} maxWidth="md" fullWidth>
        <DialogTitle>Change Status</DialogTitle>
        <DialogContent sx={{ height: "300px" }}>
          <DialogContentText>
            Change status of {currentOrder.orderNumber} -{" "}
            {currentOrder.orderDescription}
          </DialogContentText>
          <Autocomplete
            fullWidth
            disablePortal
            id="statusBox"
            name="statusBox"
            label="Change status"
            options={statusOptions}
            defaultValue={currentOrder.status}
            onChange={(e) => setNewStatus(e.target.textContent)}
            renderInput={(params) => <TextField {...params} />}
          />
        </DialogContent>
        <DialogActions>
          <ButtonGroup variant="contained">
            <Button onClick={handleStatusSubmit}>Save</Button>
            <Button onClick={toggleStatus}>Back</Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>
    </div>
  );
}
