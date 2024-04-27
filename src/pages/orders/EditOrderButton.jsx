import React from "react";
import { IconButton } from "@mui/material";
import { EditNote } from "@mui/icons-material";
import EditOrderDialog from "./EditOrderDialog";

export default function EditOrderButton(props) {
  const [open, setOpen] = React.useState(false);
  const [currentOrder, setCurrentOrder] = React.useState([]);

  const handleOpen = () => {
    setOpen(true);
    setCurrentOrder(props.params.row);
  };
  const toggleClose = () => {
    setOpen(!open);
  };
  return (
    <div>
      <IconButton onClick={handleOpen}>
        <EditNote />
      </IconButton>
      <EditOrderDialog
        open={open}
        order={currentOrder}
        toggleClose={toggleClose}
      />
    </div>
  );
}
