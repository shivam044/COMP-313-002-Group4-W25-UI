import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Grid2,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  IconButton,
  Menu,
  MenuItem as MuiMenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import decodeToken from "../helpers/decodeToken";
import {
  createTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
} from "../api/teacher";

function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [teacherData, setTeacherData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    school_email: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAllTeachers();
  }, []);

  const fetchAllTeachers = async () => {
    try {
      const teachers = await getAllTeachers();
      setTeachers(teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      showSnackbar("Failed to fetch teachers.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (teacher = null) => {
    setEditMode(!!teacher);
    setTeacherData(
      teacher || { first_name: "", last_name: "", phone: "", school_email: "" }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setTeacherData({ first_name: "", last_name: "", phone: "", school_email: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeacherData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveTeacher = async () => {
    try {
      const decodedToken = decodeToken(token);
      const userId = decodedToken?.userId;

      const requestData = {
        ...teacherData,
        uid: userId,
      };

      if (editMode) {
        await updateTeacher(teacherData._id, requestData);
        showSnackbar("Teacher updated successfully!", "success");
      } else {
        await createTeacher(requestData);
        showSnackbar("Teacher added successfully!", "success");
      }
      fetchAllTeachers(); // Refresh the list after saving
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving teacher:", error);
      showSnackbar("Failed to save teacher.", "error");
    }
  };

  const handleDeleteTeacher = async (id) => {
    try {
      await deleteTeacher(id);
      showSnackbar("Teacher deleted successfully!", "success");
      fetchAllTeachers(); // Refresh the list after deleting
    } catch (error) {
      console.error("Error deleting teacher:", error);
      showSnackbar("Failed to delete teacher.", "error");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleMenuClick = (event, teacher) => {
    setAnchorEl(event.currentTarget);
    setSelectedTeacher(teacher);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTeacher(null);
  };

  const handleEditTeacher = () => {
    handleOpenDialog(selectedTeacher);
    handleMenuClose();
  };

  const handleDelete = () => {
    handleDeleteTeacher(selectedTeacher._id);
    handleMenuClose();
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <Typography variant="h4" gutterBottom>
        Teachers
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
        sx={{ marginBottom: 3 }}
      >
        Add New Teacher
      </Button>
      <Box
        sx={{
          padding: "20px",
          columnCount: { md: 1, lg: 2, xl: 3 },
          columnGap: { md: "20px", lg: "40px" },
        }}
      >
        {teachers.map((teacher, index) => (
          <Box
            key={teacher._id || index}
            sx={{
              marginBottom: "40px",
              breakInside: "avoid",
              backgroundColor: "white",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              borderRadius: "20px",
              padding: "20px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "40px",
              }}
            >
              <Typography variant="h6" sx={{ fontSize: "var(--normal)" }}>
                {teacher.first_name} {teacher.last_name}
              </Typography>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={(event) => handleMenuClick(event, teacher)}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" color="textPrimary" sx={{ marginTop: 1 }}>
              <strong>Phone:</strong> {teacher.phone}
            </Typography>
            <Typography variant="body2" color="textPrimary">
              <strong>Email:</strong> {teacher.school_email}
            </Typography>
          </Box>
        ))}
      </Box>

      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MuiMenuItem onClick={handleEditTeacher}>Edit</MuiMenuItem>
        <MuiMenuItem onClick={handleDelete}>Delete</MuiMenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ color: "#d3d3d3" }}>
          {editMode ? "Edit Teacher" : "Add New Teacher"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            name="first_name"
            value={teacherData.first_name}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Last Name"
            name="last_name"
            value={teacherData.last_name}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Phone"
            name="phone"
            value={teacherData.phone}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="School Email"
            name="school_email"
            value={teacherData.school_email}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveTeacher} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

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

export default TeachersPage;