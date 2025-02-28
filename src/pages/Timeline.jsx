import React from "react";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import useFirebase from "../hooks/useFirebase";
import dayjs from "dayjs";

const ProductionTimeline = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "In Progress":
        return "primary";
      case "Pending":
        return "warning";
      default:
        return "grey";
    }
  };
  const { data } = useFirebase("newOrders");

  const orders = [
    { id: 1, title: "Order A", status: "Planned" },
    { id: 2, title: "Order B", status: "In Progress" },
    { id: 3, title: "Order C", status: "Completed" },
    { id: 4, title: "Order D", status: "Planned" },
    { id: 5, title: "Order E", status: "In Progress" },
  ];
  const statuses = ["Planned", "In Progress", "Completed"];

  return (
    <Grid container spacing={2}>
      {statuses.map((status) => (
        <Grid item xs={4} key={status}>
          <Typography variant="h6" gutterBottom>
            {status}
          </Typography>
          {orders
            .filter((order) => order.status === status)
            .map((order) => (
              <Card key={order.id} sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1">{order.title}</Typography>
                  {/* You can add more order details here */}
                </CardContent>
              </Card>
            ))}
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductionTimeline;
