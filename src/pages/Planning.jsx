import React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config.js";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import DragAndDropCalendarPage from "./planning/DragAndDropCalendar.jsx";

export default function Planning(props) {
  const database = collection(db, "newOrders");
  const [documents, setDocuments] = React.useState([]);
  const [selectedEvent, setSelectedEvent] = React.useState();
  const [modalState, setModalState] = React.useState(false);
  const [orderInformation, setOrderInformation] = React.useState({});

  moment.updateLocale("da", {
    week: {
      dow: 1,
    },
  });

  React.useEffect(() => {
    const getDocuments = async () => {
      const querySnapshot = await getDocs(database);
      setDocuments(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    };
    getDocuments();
  }, []);

  const handleSelectedEvent = (event) => {
    setOrderInformation(documents.find((document) => document.id === event.id));
    setSelectedEvent(event);
    setModalState(true);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item>
          <h1>Planning</h1>
        </Grid>
      </Grid>
      <DragAndDropCalendarPage
        localizer={momentLocalizer(moment)}
        documents={documents}
      />
      <Dialog
        open={modalState}
        onClose={() => setModalState(false)}
        maxWidth="md"
        fullWidth>
        <DialogTitle>Order Information</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 2 }}>
            <TextField
              label="Order Number"
              defaultValue={orderInformation.orderNumber}
              disabled
              fullWidth
            />
            <TextField
              label="Description"
              defaultValue={orderInformation.description}
              disabled
              fullWidth
            />
            <TextField
              label="Part No"
              defaultValue={orderInformation.partNo}
              disabled
              fullWidth
            />
            <TextField
              label="Quantity"
              defaultValue={orderInformation.quantity}
              disabled
              fullWidth
            />
            <TextField
              label="Start"
              defaultValue={
                !orderInformation.start
                  ? ""
                  : dayjs(orderInformation.start.toDate()).format("DD-MM-YYYY")
              }
              disabled
              fullWidth
            />
            <TextField
              label="End"
              defaultValue={
                !orderInformation.end
                  ? ""
                  : dayjs(orderInformation.end.toDate()).format("DD-MM-YYYY")
              }
              disabled
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <ButtonGroup variant="contained">
            <Button color="error" onClick={() => setModalState(false)}>
              Close
            </Button>
            {/* <Button color="success">Save</Button> */}
          </ButtonGroup>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
