// eslint-disable-next-line no-unused-vars
import React from "react";
import {
  Box,
  Divider,
  Drawer,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Inbox,
  Input,
  Login,
  Mail,
  MoneyOffCsredSharp,
  ProductionQuantityLimits,
} from "@mui/icons-material";
import PropTypes from "prop-types";

const DrawerList = (props) => {
  return (
    <Drawer open={props.open} onClose={props.toggleDrawer(false)}>
      <Box
        sx={{ width: 250 }}
        role="persistent"
        onClick={props.toggleDrawer(false)}>
        <List>
          <Link href="/products">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <ProductionQuantityLimits />
                </ListItemIcon>
                <ListItemText primary="Products" />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link href="/newOrders">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <MoneyOffCsredSharp />
                </ListItemIcon>
                <ListItemText primary="Orders" />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link href="/planning">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Mail />
                </ListItemIcon>
                <ListItemText primary="DnD" />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Inbox />
              </ListItemIcon>
              <ListItemText primary="Inbox" />
            </ListItemButton>
          </ListItem>
          <Link href="/signup">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Input />
                </ListItemIcon>
                <ListItemText primary="Sign up" />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link href="/signin">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Login />
                </ListItemIcon>
                <ListItemText primary="Sign in" />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
      </Box>
    </Drawer>
  );
};

DrawerList.propTypes = {
  toggleDrawer: PropTypes.func,
  open: PropTypes.bool,
};

export default DrawerList;
