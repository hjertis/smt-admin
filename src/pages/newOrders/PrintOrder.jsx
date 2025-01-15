import React from "react";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import PropTypes from "prop-types";

// eslint-disable-next-line react/display-name
const PrintOrder = React.forwardRef((props, ref) => {
  return (
    <div style={{ display: "none", "@media print": { display: "block" } }}>
      <Box ref={ref} sx={{ m: 5 }}>
        <Typography variant="h5" sx={{ border: "1px solid black", p: 1, m: 1 }}>
          {props.order.partNo} - {props.order.description}
        </Typography>
        <Typography variant="h6" sx={{ border: "1px solid black", p: 1, m: 1 }}>
          {props.order.orderNumber}
        </Typography>
        <Typography sx={{ border: "1px solid black", p: 1, m: 1 }}>
          Antal: {props.order.quantity}
        </Typography>
        <Typography sx={{ border: "1px solid black", p: 1, m: 1 }}>
          Start/Stop:
          <br />
          {dayjs(props.order.start.toDate()).format("YYYY-MM-DD")} -{" "}
          {dayjs(props.order.end.toDate()).format("YYYY-MM-DD")}
        </Typography>
        <Typography sx={{ border: "1px solid black", p: 1, m: 1 }}>
          Status: {props.order.status}
        </Typography>
        <Typography sx={{ border: "1px solid black", p: 1, m: 1 }}>
          State: {props.order.state}
        </Typography>
        <Typography sx={{ border: "1px solid black", p: 1, m: 1 }}>
          Sidst opdateret:{" "}
          {dayjs(props.order.updated.toDate()).format("YYYY-MM-DD")}
        </Typography>
        <Typography sx={{ border: "1px solid black", p: 1, m: 1 }}>
          Processer:{" "}
          {Array.isArray(props.order.processes)
            ? props.order.processes.join(", ")
            : props.order.processes}
        </Typography>
        <Typography
          sx={{ border: "1px solid black", p: 1, m: 1, height: "200px" }}>
          Noter: <br />
          {props.order.notes}
        </Typography>
        <Typography
          sx={{ border: "1px solid black", p: 1, m: 1, height: "200px" }}>
          Delleveringer:
        </Typography>
      </Box>
    </div>
  );
});

PrintOrder.propTypes = {
  order: PropTypes.object,
};

export default PrintOrder;
