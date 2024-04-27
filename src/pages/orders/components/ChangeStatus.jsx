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

export default function ChangeStatus(props) {
  const [openStatus, setOpenStatus] = React.useState(false);
  const [currentOrder, setCurrentOrder] = React.useState([]);
  const toggleStatus = () => {
    setOpenStatus(!openStatus);
  };
  const handleOpen = () => {
    setOpenStatus(true);
    setCurrentOrder(props.order);
  };

  return (
    <div>
      <IconButton onClick={handleOpen}>
        <Adjust />
      </IconButton>
      <Dialog open={openStatus} onClose={toggleStatus} maxWidth="md" fullWidth>
        <DialogTitle>Change Status</DialogTitle>
        <DialogContent sx={{ height: "300px" }}>
          <DialogContentText>Change status of this order.</DialogContentText>
          <Autocomplete
            fullWidth
            disablePortal
            id="statusBox"
            name="statusBox"
            label="Change status"
            options={["Setup", "Production", "Repair", "Washing", "Cutting"]}
            renderInput={(params) => <TextField {...params} />}
          />
        </DialogContent>
        <DialogActions>
          <ButtonGroup variant="contained">
            <Button>Save</Button>
            <Button onClick={toggleStatus}>Back</Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>
    </div>
  );
}
