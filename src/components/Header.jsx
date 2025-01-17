import React from "react";
import {
  AccountBox,
  AccountCircle,
  AddCircle,
  Help,
  Home,
  Login,
  Logout,
  PersonAdd,
  ShowChart,
  ViewList,
  Menu as MenuIcon,
  ProductionQuantityLimits,
  PunchClock,
} from "@mui/icons-material";
import {
  AppBar,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Link,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { CalendarIcon } from "@mui/x-date-pickers";
import PropTypes from "prop-types";

const Header = (props) => {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const renderMenu = (
    <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
      <MenuItem onClick={handleClose} component={Link} href="/account">
        <AccountCircle /> Profile
      </MenuItem>
      <MenuItem onClick={handleClose} component={Link} href="/signin">
        <Login /> Sign In
      </MenuItem>
      <MenuItem onClick={handleClose} component={Link} href="/signup">
        <PersonAdd /> Sign Up
      </MenuItem>
      <MenuItem onClick={handleClose} component={Link} href="/help">
        <Help /> Help
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <Logout /> Logout
      </MenuItem>
    </Menu>
  );

  return (
    <header>
      <AppBar component="div" color="primary" position="static" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Grid item sx={{ width: 55 }}>
              <IconButton color="inherit" onClick={props.toggleDrawer(true)}>
                <MenuIcon />
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
            <Grid item>
              <IconButton color="inherit" size="large" onClick={handleClick}>
                <AccountBox />
              </IconButton>
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
              <IconButton color="inherit" href="/">
                <Home />
              </IconButton>
              <IconButton color="inherit" href="/newOrders">
                <ViewList />
              </IconButton>
              <IconButton color="inherit" href="/products">
                <ProductionQuantityLimits />
              </IconButton>
              <IconButton color="inherit" href="/planning">
                <CalendarIcon />
              </IconButton>
              <IconButton color="inherit" href="/employees">
                <AddCircle />
              </IconButton>
              <IconButton color="inherit" href="/defects">
                <ShowChart />
              </IconButton>
              <IconButton color="inherit" href="/tasks">
                <ShowChart />
              </IconButton>
              <IconButton color="inherit" href="/clockIn">
                <PunchClock />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  toggleDrawer: PropTypes.func,
};

export default Header;
