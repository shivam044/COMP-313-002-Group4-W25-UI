import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, TextField, Switch, FormControlLabel, Divider, Button, Snackbar, Alert } from "@mui/material";
import decodeToken from "../helpers/decodeToken";
import { updateUser, getUserById } from "../api/user";

function SettingsPage() {
  const [userData, setUserData] = useState({ userName: "", email: "", firstName: "", lastName: "" });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  const userId = decodedToken?.userId;

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const user = await getUserById(userId);
      setUserData({
        username: user.userName || "",
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        role: user.role || "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      setSnackbar({ open: true, message: "Error fetching user data", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      await updateUser(userId, userData);
      setSnackbar({ open: true, message: "User details updated successfully!", severity: "success" });
    } catch (error) {
      console.error("Error updating user details:", error);
      setSnackbar({ open: true, message: "Failed to update user details.", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 4, minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
        {/* Account Details Section */}
        <Typography variant="h6" gutterBottom>
          Account Details
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 3 }}>
          <TextField
            label="Username"
            name="username"
            variant="outlined"
            fullWidth
            value={userData.username}
            onChange={handleInputChange}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            value={userData.email}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="First Name"
            name="firstName"
            variant="outlined"
            fullWidth
            value={userData.firstName}
            onChange={handleInputChange}
          />
          <TextField
            label="Last Name"
            name="lastName"
            variant="outlined"
            fullWidth
            value={userData.lastName}
            onChange={handleInputChange}
          />
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            <strong>Role:</strong> {userData.role}
          </Typography>
        </Box>

        <Divider sx={{ marginY: 2 }} />

        {/* Notifications Section */}
        <Typography variant="h6" gutterBottom>
          Notifications
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 3 }}>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Receive Email Notifications"
          />
          <FormControlLabel
            control={<Switch />}
            label="Receive SMS Notifications"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Receive Push Notifications"
          />
        </Box>

        <Divider sx={{ marginY: 2 }} />

        {/* Privacy Settings Section */}
        <Typography variant="h6" gutterBottom>
          Privacy Settings
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 3 }}>
          <FormControlLabel
            control={<Switch />}
            label="Make Profile Private"
          />
          <FormControlLabel
            control={<Switch />}
            label="Allow Location Access"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Enable Two-Factor Authentication"
          />
        </Box>

        <Divider sx={{ marginY: 2 }} />

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 3 }}>
          <Button variant="contained" color="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SettingsPage;
