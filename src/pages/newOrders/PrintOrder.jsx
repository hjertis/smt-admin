import React from "react";
import { Box, Typography } from "@mui/material";

const PrintOrder = React.forwardRef((props, ref) => {
  return (
    <div style={{ display: "none", "@media print": { display: "block" } }}>
      <Box
        ref={ref}
        sx={{
          display: "flex",
          flexDirection: "column",
          margin: 2,
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}>
        <Box
          sx={{
            border: "1px solid black",
            padding: 2,
            position: "absolute",
            top: 10,
            left: 10,
          }}>
          <Typography variant="h6">
            {props.order.orderNumber} - {props.order.description}
          </Typography>
        </Box>
        <Box
          sx={{
            border: "1px solid black",
            padding: 2,
            position: "absolute",
            top: 75,
            left: 10,
          }}>
          <Typography variant="body2">{props.order.quantity}</Typography>
        </Box>
      </Box>
    </div>
  );
});

export default PrintOrder;
