import React from "react";
import PropTypes from "prop-types";
import { Calendar, DateLocalizer } from "react-big-calendar";
import withDragAndDrop from "./dnd/dragAndDrop/withDragAndDrop";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./dnd/dragAndDrop/styles.scss";
import EventInfo from "./EventInfo";
import { TextField } from "@mui/material";

const DragAndDropCalendar = withDragAndDrop(Calendar);

export default function DragAndDropCalendarPage({ localizer, documents }) {
  const [events, setEvents] = React.useState();
  const [filterState, setFilterState] = React.useState("");

  React.useEffect(() => {
    const filteredDocuments = documents.filter(
      (document) =>
        document.status !== "Finished" &&
        document.state.toLowerCase().includes(filterState.toLowerCase())
    );
    setEvents(
      filteredDocuments.map((document) => ({
        title: document.orderNumber + " - " + document.description,
        orderNo: document.orderNumber,
        partNo: document.partNo,
        description: document.description,
        quantity: document.quantity,
        state: document.state,
        start: document.start.toDate(),
        end: document.end.toDate(),
        allDay: true,
        id: document.id,
        status: document.status,
        updated: document.updated.toDate(),
      }))
    );
  }, [documents, filterState]);

  const moveEvent = React.useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event;
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true;
      }
      if (allDay && !droppedOnAllDaySlot) {
        event.allDay = false;
      }

      setEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end, allDay: event.allDay }];
      });
    },
    [setEvents]
  );

  const handleEventDrop = async ({ event, start, end }) => {
    const documentRef = doc(db, "newOrders", event.id);
    await updateDoc(
      documentRef,
      {
        start: Timestamp.fromDate(start),
        end: Timestamp.fromDate(end),
        updated: Timestamp.fromDate(new Date()),
      },
      toast.success("Order successfully updated")
    );
    moveEvent({ event, start, end });
  };

  const resizeEvent = React.useCallback(
    ({ event, start, end }) => {
      setEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end }];
      });
    },
    [setEvents]
  );

  const handleEventResize = async ({ event, start, end }) => {
    const documentRef = doc(db, "newOrders", event.id);
    await updateDoc(
      documentRef,
      {
        start: Timestamp.fromDate(start),
        end: Timestamp.fromDate(end),
        updated: Timestamp.fromDate(new Date()),
      },
      toast.success("Order successfully resized")
    );
    resizeEvent({ event, start, end });
  };

  const { defaultDate } = React.useMemo(
    () => ({
      defaultDate: new Date(),
    }),
    []
  );

  const eventPropGetter = (event) => {
    let backgroundColor;
    switch (event.state) {
      case "SMT":
        backgroundColor = "#FF0000";
        break;
      case "THT":
        backgroundColor = "#0000FF";
        break;
      case "TEST":
        backgroundColor = "#006600";
        break;
      case "CUT":
        backgroundColor = "#ff9900";
        break;
      default:
        backgroundColor = "#2f9917";
    }
    return { style: { backgroundColor } };
  };

  const [currentEvent, setCurrentEvent] = React.useState(null);
  const [eventInfoModalOpen, setEventInfoModalOpen] = React.useState(false);
  const [openSlot, setOpenSlot] = React.useState(false);

  const handleSelectEvent = (event) => {
    setCurrentEvent(event);
    setEventInfoModalOpen(true);
  };

  const handleSelectSlot = (event) => {
    setOpenSlot(true);
    setCurrentEvent(event);
  };

  const handleClose = () => {
    setOpenSlot(false);
  };

  const onDeleteEvent = async () => {
    setEvents(() => [...events].filter((e) => e.id !== currentEvent.id));
    setEventInfoModalOpen(false);
  };

  const addEvent = async (e) => {
    e.preventDefault();
    const data = {
      start: Timestamp.fromDate(new Date()),
      end: Timestamp.fromDate(new Date()),
      id: currentEvent.orderNo,
      title: currentEvent.orderNo + " - " + currentEvent.description,
      description: currentEvent.description,
      partNo: currentEvent.partNo,
      quantity: currentEvent.quantity,
      state: currentEvent.state,
      updated: Timestamp.fromDate(new Date()),
    };
    const newEvents = [...events, data];
    setEvents(newEvents);
    handleClose();
  };

  const handleFilterStateChange = (event) => {
    setFilterState(event.target.value);
  };

  return (
    <React.Fragment>
      <ToastContainer />
      <div>
        <TextField
          label="Filter by State"
          value={filterState}
          onChange={handleFilterStateChange}
          sx={{ width: "400px", mb: 2 }}
        />
        <DragAndDropCalendar
          defaultDate={defaultDate}
          events={events}
          localizer={localizer}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          onDoubleClickEvent={handleSelectEvent}
          /* onSelectSlot={handleSelectSlot} */
          startAccessor={"start"}
          endAccessor={"end"}
          style={{ height: 1600, width: 1600 }}
          eventPropGetter={eventPropGetter}
          popup
          resizable
          selectable
        />
      </div>
      <EventInfo
        open={eventInfoModalOpen}
        handleClose={() => setEventInfoModalOpen(false)}
        onDeleteEvent={onDeleteEvent}
        currentEvent={currentEvent}
      />
    </React.Fragment>
  );
}

DragAndDropCalendarPage.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
  events: PropTypes.array,
  documents: PropTypes.array,
};
