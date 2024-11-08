import React from "react";
import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { theme } from "./data/theme";
import { ThemeProvider, CssBaseline, Container, Box } from "@mui/material";
import DrawerList from "./components/DrawerList";
import Header from "./components/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Employees from "./pages/Employees";
import Defects from "./pages/Defects";
import Tasks from "./pages/Tasks";
import Account from "./pages/Account";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import NewOrders from "./pages/NewOrders";
import Products from "./pages/Products";
import PrivateRoute from "./context/PrivateRoute";
import Planning from "./pages/Planning";

function App() {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <BrowserRouter>
            <CssBaseline />
            <Header title="SMT Administration" toggleDrawer={toggleDrawer} />
            <DrawerList open={open} toggleDrawer={toggleDrawer} />
            <Container
              maxWidth="xl"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                pt: { xs: 5, sm: 8 },
                pb: { xs: 8, sm: 12 },
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/defects" element={<Defects />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/newOrders" element={<NewOrders />} />
                <Route path="/planning" element={<Planning />} />
                <Route path="/products" element={<Products />} />
                <Route
                  path="/account"
                  element={
                    <PrivateRoute>
                      <Account />
                    </PrivateRoute>
                  }
                />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
              </Routes>
              <Box
                component="footer"
                sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
              >
                Footer
              </Box>
            </Container>
          </BrowserRouter>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
