import React from "react";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { ShowChart } from "@mui/icons-material";

export default function OrderInfo(props) {
  const [open, setOpen] = React.useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <div>
      <IconButton onClick={toggleOpen}>
        <ShowChart />
      </IconButton>
      <Dialog open={open} onClose={toggleOpen} maxWidth="lg">
        <DialogTitle>
          {props.order.orderNumber} - {props.order.orderDescription}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item>
              <Card sx={{ width: 275, textAlign: "center" }}>
                <CardContent>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom>
                    Order Number
                  </Typography>
                  <Typography variant="h5" component="div">
                    {props.order.orderNumber}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {props.order.orderDescription}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card sx={{ width: 275, textAlign: "center" }}>
                <CardContent>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom>
                    Start / Stop
                  </Typography>
                  <Typography variant="h5" component="div">
                    Start: {props.order.orderStartDate}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Stop: {props.order.orderEndDate}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card sx={{ width: 275, textAlign: "center" }}>
                <CardContent>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom>
                    Quantity
                  </Typography>
                  <Typography variant="h5" component="div">
                    {props.order.orderQuantity}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {props.order.orderNotes}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {props.order.Setup !== undefined && (
              <Grid item>
                <Card sx={{ width: 275, textAlign: "center" }}>
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom>
                      Setup
                    </Typography>
                    <Typography variant="h5" component="div">
                      {props.order.Setup.status}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Notes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
            {props.order.Production !== undefined && (
              <Grid item>
                <Card sx={{ width: 275, textAlign: "center" }}>
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom>
                      Production
                    </Typography>
                    <Typography variant="h5" component="div">
                      {props.order.Production.status}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Notes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
            {props.order.Repair !== undefined && (
              <Grid item>
                <Card sx={{ width: 275, textAlign: "center" }}>
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom>
                      Repair
                    </Typography>
                    <Typography variant="h5" component="div">
                      {props.order.Repair.status}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Notes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
          <DialogActions>
            <Button variant="contained" onClick={toggleOpen}>
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
