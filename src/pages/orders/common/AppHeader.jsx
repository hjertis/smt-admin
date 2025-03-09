import { Add, Settings } from "@mui/icons-material";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";

export default function AppHeader() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Work Order Resource Planning
        </Typography>
        <Button variant="contained" color="secondary" startIcon={<Add />}>
          New Work Order
        </Button>
        <IconButton color="inherit" sx={{ ml: 2 }}>
          <Settings />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
