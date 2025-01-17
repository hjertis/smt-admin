// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import {
  Autocomplete,
  Button,
  ButtonGroup,
  Grid,
  TextField,
} from "@mui/material";
import useFirebase from "../../hooks/useFirebase";

export default function PickJob(props) {
  const [currentJob, setCurrentJob] = React.useState();
  const { data } = useFirebase("newOrders");
  const data2 = data.map(
    (order) => order.orderNumber + " - " + order.description
  );
  return (
    <Grid container spacing={2} sx={{ width: 800 }}>
      {props.show && (
        <Grid item md={12}>
          <Autocomplete
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
          />
        </Grid>
      )}
      {currentJob && (
        <>
          <Grid item md={12}>
            <p>Job number: {currentJob.orderNo}</p>
            <p>Description: {currentJob.description}</p>
            <p>Status: {currentJob.status}</p>
            <p>Quantity: {currentJob.quantity}</p>
            <p>Part number: {currentJob.partNo}</p>
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
          </Grid>
          <Grid item md={12}>
            {props.initials} start work
            <br />
            <ButtonGroup variant="contained">
              <Button onClick={() => alert("Started " + props.initials)}>
                Start
              </Button>
              <Button onClick={() => alert("Paused " + props.initials)}>
                Pause
              </Button>
              <Button onClick={() => alert("Stopped " + props.initials)}>
                Stop
              </Button>
            </ButtonGroup>
          </Grid>
        </>
      )}
    </Grid>
  );
}

PickJob.propTypes = {
  show: PropTypes.bool,
  initials: PropTypes.string,
};
