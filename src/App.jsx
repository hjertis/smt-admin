import React from "react";
import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { theme } from "./data/theme";
import { Box, ThemeProvider, CssBaseline } from "@mui/material";
import DrawerList from "./components/DrawerList";
import Header from "./components/Header";
import { BrowserRouter } from "react-router-dom";

function App() {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Box>
          <CssBaseline />
          <Header title="SMT Administration" toggleDrawer={toggleDrawer} />
          <DrawerList open={open} toggleDrawer={toggleDrawer} />
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}></Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
