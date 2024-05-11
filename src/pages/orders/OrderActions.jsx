import {
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { db } from "../../firebase-config";

export default function OrderActions(props) {
  const [currentOrder, setCurrentOrder] = React.useState(props.order);

  const addTime = async () => {
    try {
      const docRef = await setDoc(
        doc(db, "orders", currentOrder.orderNumber),
        {
          [currentOrder.status]: {
            status: "Started",
            startTime: Date.now(),
          },
        },
        { merge: true }
      );
    } catch (err) {
      console.log(err.message);
    } finally {
      props.toggle();
      window.location.reload();
    }
  };

  const stopTime = async () => {
    try {
      const docRef = await setDoc(
        doc(db, "orders", currentOrder.orderNumber),
        {
          [currentOrder.status]: {
            status: "Stopped",
            stopTime: Date.now(),
          },
        },
        { merge: true }
      );
    } catch (err) {
      console.log(err.message);
    } finally {
      props.toggle();
      window.location.reload();
    }
  };

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
        {currentOrder.status !== "New" && (
          <ButtonGroup variant="contained">
            <Button onClick={addTime}>
              Start time for {currentOrder.status}
            </Button>
            <Button onClick={stopTime}>
              Stop time for {currentOrder.status}
            </Button>
          </ButtonGroup>
        )}
      </DialogContent>
    </Dialog>
  );
}
