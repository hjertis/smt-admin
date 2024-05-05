import {
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";

export default function OrderActions(props) {
  const [currentOrder, setCurrentOrder] = React.useState(props.order);

  return (
    <Dialog open={props.open} onClose={props.toggle}>
      <DialogTitle>Order Actions</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Actions for order {currentOrder.orderNumber} -{" "}
          {currentOrder.orderDescription}
        </DialogContentText>
        {currentOrder.status === "New" && (
          <Typography>Please update status to something else</Typography>
        )}
        {currentOrder.status === "Setup" && (
          <ButtonGroup variant="contained">
            <Button>Start time for {currentOrder.status}</Button>
            <Button>Stop time for {currentOrder.status}</Button>
          </ButtonGroup>
        )}
      </DialogContent>
    </Dialog>
  );
}
