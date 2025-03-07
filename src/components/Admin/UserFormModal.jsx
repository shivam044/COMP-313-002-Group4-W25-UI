import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from "@mui/material";

function UserFormModal({ open, handleClose, handleSave, formData, handleChange, mode }) {
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{mode === "create" ? "Create New User" : "Edit User"}</DialogTitle>
            <DialogContent>
                {/* Username Field */}
                <TextField
                    name="userName"
                    label="Username"
                    fullWidth
                    value={formData.userName || ""} 
                    onChange={handleChange}
                    required
                    sx={{ marginBottom: 2 }}
                />

                {/* First Name Field */}
                <TextField
                    name="firstName"
                    label="First Name"
                    fullWidth
                    value={formData.firstName || ""}
                    onChange={handleChange}
                    required
                    sx={{ marginBottom: 2 }}
                />

                {/* Last Name Field */}
                <TextField
                    name="lastName"
                    label="Last Name"
                    fullWidth
                    value={formData.lastName || ""}
                    onChange={handleChange}
                    required
                    sx={{ marginBottom: 2 }}
                />

                {/* Email Field */}
                <TextField
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    value={formData.email || ""}
                    onChange={handleChange}
                    required
                    sx={{ marginBottom: 2 }}
                />

                {/* Role Selection */}
                <FormControl fullWidth required sx={{ marginBottom: 2 }}>
                    <InputLabel id="role-select-label">Role</InputLabel>
                    <Select
                        labelId="role-select-label"
                        name="role"
                        value={formData.role || "student"}  // Ensure default value is set
                        onChange={handleChange}
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="advisor">Advisor</MenuItem>
                        <MenuItem value="student">Student</MenuItem>
                    </Select>
                </FormControl>

                {/* Password Field */}
                <TextField
                    name="password"
                    label={mode === "create" ? "Password" : "New Password (optional)"}
                    type="password"
                    fullWidth
                    value={formData.password || ""}
                    onChange={handleChange}
                    sx={{ marginBottom: 2 }}
                />
            </DialogContent>

            {/* Dialog Actions */}
            <DialogActions>
                <Button onClick={handleClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={
                        !formData.userName ||  // Ensure username is provided
                        !formData.firstName ||
                        !formData.lastName ||
                        !formData.email ||
                        !formData.role
                    }
                >
                    {mode === "create" ? "Create User" : "Update User"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default UserFormModal;
