import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signIn } from "../api/auth"; // Import the signIn method

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset the error state before making the request

    try {
      // Call the signIn method with the user's credentials
      const response = await signIn({ email, password });

      if (response?.token) {
        console.log("Login successful:", response);
        // Navigate to the Dashboard after successful login
        navigate("/dashboard");
      } else {
        setError("Unexpected error occurred. Please try again.");
      }
    } catch (error) {
      // Display a more user-friendly error message
      setError("Login failed. Please check your email and password.");
      console.error("Error:", error);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          borderRadius: "10px",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        {error && (
          <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
            {error}
          </Typography>
        )}
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: 2,
          }}
          onSubmit={handleSubmit}
        >
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: 2, padding: "10px" }}
          >
            Login
          </Button>
        </Box>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          Don't have an account?
        </Typography>
        <Button
          variant="text"
          color="primary"
          onClick={() => navigate("/signup")}
          sx={{ marginTop: 1 }}
        >
          Sign Up
        </Button>
      </Paper>
    </Container>
  );
}

export default LoginPage;