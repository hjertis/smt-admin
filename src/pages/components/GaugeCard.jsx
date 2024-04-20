import React from "react";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";

export default function GaugeCard(props) {
  return (
    <Card
      sx={{
        maxWidth: props.size,
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}>
      <CardContent>
        <Gauge
          width={200}
          height={200}
          value={60}
          startAngle={-110}
          endAngle={110}
        />
        <Typography gutterBottom variant="h5" component="div">
          {props.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ height: "40px", overflow: "hidden" }}>
          {props.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button size="small">Learn more</Button>
        <Button size="small">Share</Button>
      </CardActions>
    </Card>
  );
}
