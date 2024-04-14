import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { SparkLineChart } from "@mui/x-charts";

export default function Cards(props) {
  return (
    <Card
      sx={{
        maxWidth: props.size,
        minHeight: 350,
        position: "relative",
        backgroundColor: "#f5f5f5",
      }}>
      <CardContent>
        <SparkLineChart
          data={props.sparkline}
          height={140}
          plotType={props.plotType}
        />
        <Typography gutterBottom variant="h5" component="div">
          {props.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <Button size="small">Learn more</Button>
        <Button size="small">Share</Button>
      </CardActions>
    </Card>
  );
}
