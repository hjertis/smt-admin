import React from "react";
import { LockPerson } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Account(props) {
  const displayNameRef = React.useRef();
  const emailRef = React.useRef();
  const passwordRef = React.useRef();
  const navigate = useNavigate();
  const { currentUser, updateEmail, updatePassword, updateProfile } = useAuth();

  const handleUpdateName = async () => {
    try {
      await updateProfile({ displayName: displayNameRef.current.value });
    } catch (err) {
      console.log(err.message);
    } finally {
      navigate("/account");
    }
  };

  const handleUpdateEmail = async () => {
    try {
      await updateEmail(emailRef.current.value);
    } catch (err) {
      console.log(err.message);
    } finally {
      navigate("/account");
    }
  };

  const handleUpdatePassword = async () => {
    try {
      await updatePassword({
        currentUser,
        password: passwordRef.current.value,
      });
    } catch (err) {
      console.log(err.message);
    } finally {
      navigate("/account");
    }
  };

  return (
    <Grid container component="main">
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockPerson />
          </Avatar>
          <Typography component="h1" variant="h5">
            Account Details {currentUser.displayName}
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1, width: "100%" }}>
            <Stack spacing={2}>
              <TextField
                margin="normal"
                fullWidth
                id="displayName"
                label="Display Name"
                name="displayName"
                autoComplete="displayName"
                autoFocus
                inputRef={displayNameRef}
                defaultValue={currentUser.displayName}
              />
              <Button onClick={handleUpdateName} variant="contained">
                Update
              </Button>
              <TextField
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                inputRef={emailRef}
                defaultValue={currentUser.email}
              />
              <Button onClick={handleUpdateEmail} variant="contained">
                Update
              </Button>
              <TextField
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                inputRef={passwordRef}
                autoComplete="current-password"
              />
              <Button onClick={handleUpdatePassword} variant="contained">
                Update
              </Button>
            </Stack>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
