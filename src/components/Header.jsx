import React from "react";
import { AddCircle, Help, Home, Menu, ShowChart } from "@mui/icons-material";
import {
  AppBar,
  Button,
  Grid,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

const Header = (props) => {
  return (
    <header>
      <AppBar component="div" color="primary" position="static" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Grid item sx={{ width: 55 }}>
              <IconButton color="inherit" onClick={props.toggleDrawer(true)}>
                <Menu />
              </IconButton>
            </Grid>
            <Grid item lg>
              <Typography
                color="inherit"
                variant="h5"
                component="h1"
                textAlign="center">
                {props.title}
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        position="static"
        elevation={0}
        sx={{ zIndex: 0, boxShadow: "0px 5px 5px grey" }}>
        <Toolbar>
          <Grid container spacing={1} textAlign="center">
            <Grid item xs>
              <IconButton color="inherit">
                <Home />
              </IconButton>
              <IconButton color="inherit">
                <AddCircle />
              </IconButton>
              <IconButton color="inherit">
                <ShowChart />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
