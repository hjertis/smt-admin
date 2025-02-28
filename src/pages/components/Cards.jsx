// eslint-disable-next-line no-unused-vars
import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { SparkLineChart } from "@mui/x-charts";
import PropTypes from "prop-types";

export default function Cards(props) {
  return (
    <Card
      sx={{
        maxWidth: props.size,
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
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

Cards.propTypes = {
  size: PropTypes.any,
  title: PropTypes.string,
  description: PropTypes.string,
  sparkline: PropTypes.array,
  plotType: PropTypes.string,
};
