import React from "react";
import { LockOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignUp(props) {
  const emailRef = React.useRef();
  const passwordRef = React.useRef();
  const passwordConfirmRef = React.useRef();
  const { signup } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return toast.error("Passwords do not match");
    }
    try {
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate("/signin");
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };
  return (
    <Grid container component="main" sx={{ height: "65vh" }}>
      <ToastContainer />
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
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSignUp}
            sx={{ mt: 1, width: "100%" }}>
            <Stack spacing={2}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                inputRef={emailRef}
                disable={loading}
              />
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                inputRef={passwordRef}
                disable={loading}
              />
              <TextField
                required
                fullWidth
                name="passwordConfirm"
                label="Confirm Password"
                type="password"
                autoComplete="current-password"
                inputRef={passwordConfirmRef}
                disable={loading}
              />
              <Button type="submit" variant="contained" color="primary">
                SIGN UP
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="#" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Stack>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
