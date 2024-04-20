import React from "react";
import {
  AccountBox,
  AddCircle,
  Home,
  ShowChart,
  ViewList,
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

const Header = (props) => {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(false);
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
    <Menu
      id="user-menu"
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      keepMounted
      MenuListProps={{
        "aria-labelledby": "user-menu",
      }}>
      <MenuItem onClick={handleClose} component={Link} href="/account">
        Profile
      </MenuItem>
      <MenuItem onClick={handleClose} component={Link} href="/signin">
        Sign In
      </MenuItem>
      <MenuItem onClick={handleClose} component={Link} href="/signup">
        Sign Up
      </MenuItem>
      <MenuItem onClick={handleClose} component={Link} href="/help">
        Help
      </MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

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
              <IconButton color="inherit" href="/orders">
                <ViewList />
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
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </header>
  );
};

export default Header;
