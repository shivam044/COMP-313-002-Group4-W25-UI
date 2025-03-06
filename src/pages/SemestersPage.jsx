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
  createSemester,
  getAllSemesters,
  updateSemester,
  deleteSemester,
} from "../api/semester";

function SemestersPage() {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [semesterData, setSemesterData] = useState({ title: "", startDate: "", endDate: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      if (!token) throw new Error("No token found");
      const semesters = await getAllSemesters();
      setSemesters(semesters);
    } catch (error) {
      console.error("Error fetching semesters:", error);
      showSnackbar("Failed to fetch semesters.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (semester = null) => {
    setEditMode(!!semester);
    setSemesterData(semester || { title: "", startDate: "", endDate: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setSemesterData({ title: "", startDate: "", endDate: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSemesterData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveSemester = async () => {
    try {
      const decodedToken = decodeToken(token);
      const userId = decodedToken?.userId;

      const requestData = {
        ...semesterData,
        uid: userId,
      };

      if (editMode) {
        await updateSemester(semesterData._id, requestData);
        showSnackbar("Semester updated successfully!", "success");
      } else {
        await createSemester(requestData);
        showSnackbar("Semester added successfully!", "success");
      }
      fetchSemesters(); // Refresh the list after saving
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving semester:", error);
      showSnackbar("Failed to save semester.", "error");
    }
  };

  const handleDeleteSemester = async (id) => {
    try {
      await deleteSemester(id);
      showSnackbar("Semester deleted successfully!", "success");
      fetchSemesters(); // Refresh the list after deleting
    } catch (error) {
      console.error("Error deleting semester:", error);
      showSnackbar("Failed to delete semester.", "error");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleMenuClick = (event, semester) => {
    setAnchorEl(event.currentTarget);
    setSelectedSemester(semester);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSemester(null);
  };

  const handleEditSemester = () => {
    handleOpenDialog(selectedSemester);
    handleMenuClose();
  };

  const handleDelete = () => {
    handleDeleteSemester(selectedSemester._id);
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
        Semesters
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ marginBottom: 3 }}>
        Add New Semester
      </Button>
      <Box
        sx={{
          padding: "20px",
          columnCount: { md: 1, lg: 2, xl: 3 },
          columnGap: { md: "20px", lg: "40px" },
        }}
      >
        {semesters.map((semester, index) => (
          <Box
            key={semester.id || index}
            sx={{
              marginBottom: "40px",
              breakInside: "avoid",
              backgroundColor: "white",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              borderRadius: "20px",
              padding: "20px",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: "40px" }}>
              <Typography variant="h6" sx={{ fontSize: "var(--normal)" }}>
                {semester.title}
              </Typography>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={(event) => handleMenuClick(event, semester)}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" color="textPrimary" sx={{ marginTop: 1 }}>
              <strong>Start Date:</strong> {new Date(semester.startDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="textPrimary">
              <strong>End Date:</strong> {new Date(semester.endDate).toLocaleDateString()}
            </Typography>
          </Box>
        ))}
      </Box>

      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MuiMenuItem onClick={handleEditSemester}>Edit</MuiMenuItem>
        <MuiMenuItem onClick={handleDelete}>Delete</MuiMenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editMode ? "Edit Semester" : "Add New Semester"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            value={semesterData.title}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            fullWidth
            value={semesterData.startDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            fullWidth
            value={semesterData.endDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveSemester} color="primary">
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

export default SemestersPage;
