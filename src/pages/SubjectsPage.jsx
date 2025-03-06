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
  Autocomplete,
  IconButton,
  Menu,
  MenuItem as MuiMenuItem,

} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import decodeToken from "../helpers/decodeToken";
import {
  createSubject,
  getSubjectsByUser,
  updateSubject,
  deleteSubject,
} from "../api/subject";
import { getAllTeachers } from "../api/teacher";
import { getAllSemesters } from "../api/semester";

function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [subjectData, setSubjectData] = useState({
    subjectTitle: "",
    targetGrade: "",
    room: "",
    semester_id: "",
    t_uid: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUserSubjects();
    fetchAllTeachers();
    fetchAllSemesters();
  }, []);

  const fetchUserSubjects = async () => {
    try {
      if (!token) throw new Error("No token found");
      const decodedToken = decodeToken(token);
      const userId = decodedToken?.userId;
      const subjects = await getSubjectsByUser(userId);
      setSubjects(subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      showSnackbar("Failed to fetch subjects.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTeachers = async () => {
    try {
      const teachers = await getAllTeachers();
      setTeachers(teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const fetchAllSemesters = async () => {
    try {
      const semesters = await getAllSemesters();
      setSemesters(semesters);
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (subject = null) => {
    setEditMode(!!subject);
    setSubjectData(
      subject || { subjectTitle: "", targetGrade: "", room: "", semester_id: "", t_uid: "" }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setSubjectData({
      subjectTitle: "",
      targetGrade: "",
      room: "",
      semester_id: "",
      t_uid: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubjectData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveSubject = async () => {
    try {
      const decodedToken = decodeToken(token);
      const userId = decodedToken?.userId;

      const requestData = {
        ...subjectData,
        uid: userId,
        t_uid: subjectData.t_uid,
        semester_id: subjectData.semester_id,
      };

      if (editMode) {
        await updateSubject(subjectData._id, requestData);
        showSnackbar("Subject updated successfully!", "success");
      } else {
        await createSubject(requestData);
        showSnackbar("Subject added successfully!", "success");
      }
      fetchUserSubjects();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving subject:", error);
      showSnackbar("Failed to save subject.", "error");
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      await deleteSubject(id);
      showSnackbar("Subject deleted successfully!", "success");
      fetchUserSubjects();
    } catch (error) {
      console.error("Error deleting subject:", error);
      showSnackbar("Failed to delete subject.", "error");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleMenuClick = (event, subject) => {
    setAnchorEl(event.currentTarget);
    setSelectedSubject(subject);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSubject(null);
  };

  const handleEditSubject = () => {
    handleOpenDialog(selectedSubject);
    handleMenuClose();
  };

  const handleDelete = () => {
    handleDeleteSubject(selectedSubject._id);
    handleMenuClose();
  };

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <Typography variant="h4" gutterBottom>
        Subjects
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
        sx={{ marginBottom: 3 }}
      >
        Add New Subject
      </Button>
      <Box
        sx={{
          padding: "20px",
          columnCount: { md: 1, lg: 2, xl: 3 },
          columnGap: { md: "20px", lg: "40px" },
        }}
      >
        {subjects.map((subject, index) => (
          <Box
            key={subject.id || index}
            sx={{
              marginBottom: "40px",
              breakInside: "avoid",
              backgroundColor: "white",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              borderRadius: "20px",
              padding: "20px",
              position: "relative",
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
                {subject.subjectTitle}
              </Typography>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={(event) => handleMenuClick(event, subject)}
                sx={{ position: "absolute", top: "10px", right: "10px" }}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" color="textPrimary" sx={{ marginTop: 1 }}>
              <strong>Teacher:</strong> {subject.t_uid?.first_name} {subject.t_uid?.last_name}
            </Typography>
            <Typography variant="body2" color="textPrimary">
              <strong>Email:</strong> {subject.t_uid?.school_email}
            </Typography>
            <Typography variant="body2" color="textPrimary">
              <strong>Room:</strong> {subject.room}
            </Typography>
            <Typography variant="body2" color="textPrimary">
              <strong>Semester:</strong> {subject.semester_id?.title}
            </Typography>
            <Typography variant="body2" color="textPrimary">
              <strong>Target Grade:</strong> {subject.targetGrade}%
            </Typography>
          </Box>
        ))}
      </Box>

      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MuiMenuItem onClick={handleEditSubject}>Edit</MuiMenuItem>
        <MuiMenuItem onClick={handleDelete}>Delete</MuiMenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ color: "#d3d3d3" }}>
          {editMode ? "Edit Subject" : "Add New Subject"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Subject Title"
            name="subjectTitle"
            value={subjectData.subjectTitle}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Target Grade"
            name="targetGrade"
            type="number"
            value={subjectData.targetGrade}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Room"
            name="room"
            value={subjectData.room}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <Box>
            <Autocomplete
              options={semesters}
              getOptionLabel={(option) => option.title || ""}
              value={
                semesters.find((semester) => semester._id === subjectData.semester_id?._id) || null
              }
              onChange={(event, newValue) => {
                setSubjectData({
                  ...subjectData,
                  semester_id: newValue ? newValue : "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Semester"
                  name="semester_id"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
              )}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              fullWidth
              sx={{ width: "100%" }}
            />
          </Box>
          <Box>
            <Autocomplete
              options={teachers}
              getOptionLabel={(option) => `${option.first_name} ${option.last_name}` || ""}
              value={teachers.find((teacher) => teacher._id === subjectData.t_uid?._id) || null}
              onChange={(event, newValue) => {
                setSubjectData({
                  ...subjectData,
                  t_uid: newValue ? newValue : "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Teacher"
                  name="t_uid"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
              )}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              fullWidth
              sx={{ width: "100%" }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveSubject} color="primary">
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

export default SubjectsPage;
