import React from "react";
import { Box, Grid } from "@mui/material";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import * as dates from "../data/dates";
import "react-big-calendar/lib/css/react-big-calendar.css";

export default function Planning(props) {
  const database = collection(db, "newOrders");
  const [documents, setDocuments] = React.useState([]);

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
          title: document.orderNumber,
          start: document.start.toDate(),
          end: document.end.toDate(),
          id: document.id,
        }))}
        components={components}
        defaultDate={defaultDate}
        views={views}
        max={max}
        showMultiDayTimes
        step={60}
        startAccessor={"start"}
        endAccessor={"end"}
        style={{ height: 1200, width: 1600 }}
      />
    </Box>
  );
}
