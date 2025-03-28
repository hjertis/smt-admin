import React from "react";
import PropTypes from "prop-types";
import {
  Autocomplete,
  Button,
  ButtonGroup,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import useFirebase from "../../hooks/useFirebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase-config";
import dayjs from "dayjs";
import Jobinfo from "./Jobinfo";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PickJob(props) {
  const [currentJob, setCurrentJob] = React.useState();
  const { data } = useFirebase("newOrders");
  const { data: times } = useFirebase(`newOrders/${currentJob?.id}/workTimes`);
  const filteredData = data.filter((order) => order.status !== "Finished");
  const data2 = filteredData.map(
    (order) => order.orderNumber + " - " + order.description
  );
  console.log(times);
  const submitStartTimes = async (e) => {
    e.preventDefault();
    try {
      const employeeRef = doc(
        db,
        "employees",
        props.initials,
        "workTimes",
        dayjs().format("DD-MM-YYYY")
      );
      const orderRef = doc(
        db,
        "newOrders",
        currentJob.orderNumber,
        "workTimes",
        dayjs().format("DD-MM-YYYY")
      );

      await setDoc(
        employeeRef,
        {
          start: Timestamp.fromDate(new Date()),
          job: currentJob.orderNumber,
        },
        { merge: true }
      );
      await setDoc(
        orderRef,
        {
          start: Timestamp.fromDate(new Date()),
          initials: props.initials,
        },
        { merge: true }
      );
    } catch (err) {
      console.log(err);
    } finally {
      toast.success(
        "Successfully started work on order " + currentJob.orderNumber
      );
    }
  };

  const submitStopTimes = async (e) => {
    e.preventDefault();
    try {
      const employeeRef = doc(
        db,
        "employees",
        props.initials,
        "workTimes",
        dayjs().format("DD-MM-YYYY")
      );
      const orderRef = doc(
        db,
        "newOrders",
        currentJob.orderNumber,
        "workTimes",
        dayjs().format("DD-MM-YYYY")
      );

      await setDoc(
        employeeRef,
        {
          stop: Timestamp.fromDate(new Date()),
        },
        { merge: true }
      );
      await setDoc(
        orderRef,
        {
          stop: Timestamp.fromDate(new Date()),
        },
        { merge: true }
      );
    } catch (err) {
      console.log(err);
    } finally {
      toast.success(
        "Successfully stopped work on order " + currentJob.orderNumber
      );
    }
  };

  return (
    <Grid container spacing={2}>
      <ToastContainer />
      {props.show && (
        <Grid item md={6}>
          {/* <Autocomplete
            disablePortal
            options={data2}
            fullWidth
            onChange={(event, newValue) => {
              const job = newValue.split(" - ")[0];
              const order = data.find((order) => job === order.orderNumber);
              setCurrentJob(order);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Enter Job Number" />
            )}
          /> */}
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              position: "relative",
              overflow: "auto",
              maxHeight: 600,
              "& ul": { padding: 0 },
            }}>
            {data.map((order) => {
              return (
                <ListItem key={order.orderNumber}>
                  <ListItemButton
                    onClick={() => {
                      setCurrentJob(order);
                    }}>
                    <ListItemText
                      primary={order.orderNumber + " - " + order.description}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Grid>
      )}
      {currentJob && (
        <>
          <Grid item md={6}>
            <p>Job number: {currentJob.orderNumber}</p>
            <p>Part number: {currentJob.partNo}</p>
            <p>Description: {currentJob.description}</p>
            <p>Status: {currentJob.status}</p>
            <p>Quantity: {currentJob.quantity}</p>
            <p>
              Start: {currentJob.start.toDate().toLocaleString().split(",")[0]}
            </p>
            <p>End: {currentJob.end.toDate().toLocaleString().split(",")[0]}</p>
            <p>Notes: {currentJob.notes}</p>
            <p>State: {currentJob.state}</p>
            <p>
              Updated:{" "}
              {currentJob.updated.toDate().toLocaleString().split(",")[0]}
            </p>
            <Jobinfo jobId={currentJob.orderNo} workTimes={times} />
            <Typography variant="body1">
              Current Time: {dayjs().format("HH:mm:ss")}
              <br />
              Current Date: {dayjs().format("YYYY-MM-DD")}
              <br />
              Start or stop work now {props.initials}
            </Typography>
            <ButtonGroup variant="contained">
              <Button onClick={submitStartTimes}>Start</Button>
              <Button onClick={submitStopTimes}>Stop</Button>
            </ButtonGroup>
          </Grid>
          <Grid item md={12}></Grid>
        </>
      )}
    </Grid>
  );
}

PickJob.propTypes = {
  show: PropTypes.bool,
  initials: PropTypes.string,
};
