import React from "react";
import { PieChart } from "@mui/x-charts";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";

export default function PieCard(props) {
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
        <PieChart
          series={props.pie}
          height={200}
          slotProps={{
            legend: {
              sx: {
                display: "none",
              },
            },
          }}
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
