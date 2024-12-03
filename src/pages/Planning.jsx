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
} from "@mui/material";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import * as dates from "../data/dates";
import "react-big-calendar/lib/css/react-big-calendar.css";

export default function Planning(props) {
  const database = collection(db, "newOrders");
  const [documents, setDocuments] = React.useState([]);
  const [selectedEvent, setSelectedEvent] = React.useState();
  const [modalState, setModalState] = React.useState(false);
  const [orderInformation, setOrderInformation] = React.useState({});

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

  const ColoredDateCellWrapper = ({ children }) =>
    React.cloneElement(React.Children.only(children), {
      style: {
        backgroundColor: "lightblue",
      },
    });

  const { components, defaultDate, max, views } = React.useMemo(
    () => ({
      components: {
        timeSlotWrapper: ColoredDateCellWrapper,
      },
      defaultDate: new Date(),
      max: new Date(),
      views: Object.keys(Views).map((k) => Views[k]),
    }),
    []
  );

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item>
          <h1>Planning</h1>
        </Grid>
      </Grid>
      <Calendar
        localizer={momentLocalizer(moment)}
        events={documents.map((document) => ({
          title: document.orderNumber + " - " + document.description,
          start: document.start.toDate(),
          end: document.end.toDate(),
          id: document.id,
          allDay: true,
        }))}
        components={components}
        defaultDate={defaultDate}
        views={views}
        max={max}
        showMultiDayTimes
        showAllEvents
        step={60}
        startAccessor={"start"}
        endAccessor={"end"}
        style={{ height: 1600, width: 1600 }}
        onSelectEvent={(e) => handleSelectedEvent(e)}
      />
      <Dialog open={modalState} onClose={() => setModalState(false)}>
        <DialogTitle>Order Information</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <p>Order Number: {orderInformation.orderNumber}</p>
            <p>Description: {orderInformation.description}</p>
            <p>Part No: {orderInformation.partNo}</p>
            <p>Quantity: {orderInformation.quantity}</p>
            <p>
              Start:{" "}
              {!orderInformation.start
                ? ""
                : orderInformation.start.toDate().toLocaleString()}
            </p>
            <p>
              End:{" "}
              {!orderInformation.end
                ? ""
                : orderInformation.end.toDate().toLocaleString()}
            </p>
          </Stack>
        </DialogContent>
        <DialogActions>
          <ButtonGroup variant="contained">
            <Button color="error" onClick={() => setModalState(false)}>
              Close
            </Button>
            <Button color="success">Save</Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
