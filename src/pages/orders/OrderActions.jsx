import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";
import SetupDialog from "./components/SetupDialog";

export default function OrderActions(props) {
  const [documents, setDocuments] = React.useState([]);
  const orderNo = props.order.orderNumber;
  const database = collection(db, "orders", orderNo || "123", "subtasks"); // Do not remove "123", shit breaks
  const [click, setClick] = React.useState(false);
  const subtasks = documents.sort((a, b) => a.taskNumber - b.taskNumber);
  const [openSetup, setOpenSetup] = React.useState(false);
  const [openProduction, setOpenProduction] = React.useState(false);
  const [openRepair, setOpenRepair] = React.useState(false);
  const [openWashing, setOpenWashing] = React.useState(false);
  const [openCutting, setOpenCutting] = React.useState(false);

  const getAllDocs = async () => {
    const docs = await getDocs(database);
    setDocuments(
      docs.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
    );
  };

  React.useEffect(() => {
    getAllDocs();
  }, [click]);

  const toggleSetup = () => {
    setOpenSetup(!openSetup);
  };

  return (
    <div>
      <Dialog open={props.open} onClose={props.toggle} maxWidth="sm" fullWidth>
        <DialogTitle>Actions for order {props.order.orderNumber}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
          <DialogContentText>
            Here is a list of actions for order {props.order.orderNumber}
          </DialogContentText>
          <Button onClick={() => setClick(!click)}>Click Me</Button>
          {documents.map((task, index) => {
            return (
              <Button key={index} onClick={() => setOpenSetup(!openSetup)}>
                Start / Stop {task.taskName}
              </Button>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button>Finish Order</Button>
        </DialogActions>
      </Dialog>
      <SetupDialog open={openSetup} toggle={toggleSetup} />
    </div>
  );
}
