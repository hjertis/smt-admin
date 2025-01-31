import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";
import useFirebase from "../../hooks/useFirebase";
import dayjs from "dayjs";

export default function Punchclock(props) {
  const { data } = useFirebase(`newOrders/${props.order.id}/workTimes`);
  return (
    <Dialog
      maxwidth="md"
      fullWidth
      open={props.open}
      onClose={props.toggleClose}>
      <DialogTitle>Punch Times for {props.order.orderNo}</DialogTitle>
      <DialogContent>
        {data.map((time) => (
          <div key={time.id}>
            {dayjs(time.start.toDate()).format("YYYY-MM-DD HH:mm")} -{" "}
            {dayjs(time.stop.toDate()).format("YYYY-MM-DD HH:mm")} - by{" "}
            {time.initials}
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={props.toggleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
