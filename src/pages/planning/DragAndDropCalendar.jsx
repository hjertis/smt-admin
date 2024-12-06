import React from "react";
import PropTypes from "prop-types";
import { Calendar, Views, DateLocalizer } from "react-big-calendar";
import withDragAndDrop from "./dnd/dragAndDrop/withDragAndDrop";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./dnd/dragAndDrop/styles.scss";

const DragAndDropCalendar = withDragAndDrop(Calendar);

export default function DragAndDropCalendarPage({ localizer, documents }) {
  const [events, setEvents] = React.useState();

  React.useEffect(() => {
    const filteredDocuments = documents.filter(
      (document) => document.status !== "Finished"
    );
    setEvents(
      filteredDocuments.map((document) => ({
        title: document.orderNumber + " - " + document.description,
        start: document.start.toDate(),
        end: document.end.toDate(),
        allDay: true,
        id: document.id,
      }))
    );
  }, [documents]);

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

  const { components, defaultDate, max, views } = React.useMemo(
    () => ({
      defaultDate: new Date(),
      max: new Date(),
      views: Object.keys(Views).map((k) => Views[k]),
    }),
    []
  );

  return (
    <React.Fragment>
      <ToastContainer />
      <div>
        <DragAndDropCalendar
          defaultDate={defaultDate}
          events={events}
          localizer={localizer}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          startAccessor={"start"}
          endAccessor={"end"}
          style={{ height: 1600, width: 1600 }}
          popup
          resizable
        />
      </div>
    </React.Fragment>
  );
}

DragAndDropCalendarPage.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
};
