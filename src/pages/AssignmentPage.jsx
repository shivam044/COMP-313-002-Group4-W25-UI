import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
} from "@mui/material";
import {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentsByUser,
} from "../api/assignment";
import { getSubjectsByUser } from "../api/subject";
import decodeToken from "../helpers/decodeToken";

function AssignmentsPage() {
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [newAssignment, setNewAssignment] = useState({
    name: "",
    s_id: "",
    due_date: new Date().toISOString().split("T")[0],
  });
  const [editMode, setEditMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignmentToEdit, setAssignmentToEdit] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSubjectsAndAssignments();
  }, []);

  const fetchSubjectsAndAssignments = async () => {
    try {
      if (!token) throw new Error("No token found");
      const decodedToken = decodeToken(token);
      const userId = decodedToken?.userId;

      const [subjects, assignments] = await Promise.all([
        getSubjectsByUser(userId),
        getAssignmentsByUser(userId),
      ]);
      setSubjects(subjects);
      setNewAssignment({ ...newAssignment, s_id: subjects[0]?._id || "" });
      setAssignmentsList(assignments);
    } catch (error) {
      console.error("Error fetching data:", error);
      setSnackbar({
        open: true,
        message: "Error loading data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setNewAssignment({ ...newAssignment, s_id: subjects[newValue]._id });
    setSelectedTab(newValue);
  };

  const getAssignmentsForSubject = (subjectId) => {
    return assignmentsList.filter(
      (assignment) => assignment.s_id && assignment.s_id._id === subjectId
    );
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleInputChange = (e) => {
    setNewAssignment({ ...newAssignment, [e.target.name]: e.target.value });
  };

  const handleAddAssignment = async () => {
    if (!newAssignment.name || !newAssignment.s_id || !newAssignment.due_date) {
      setSnackbar({
        open: true,
        message: "All fields are required",
        severity: "error",
      });
      return;
    }

    const decodedToken = decodeToken(token);
    const userId = decodedToken?.userId;

    const updatedAssignmentData = {
      ...newAssignment,
      uid: userId,
    };

    try {
      if (editMode) {
        await updateAssignment(assignmentToEdit._id, updatedAssignmentData);
        setAssignmentsList((prevList) =>
          prevList.map((assignment) =>
            assignment._id === assignmentToEdit._id
              ? { ...assignment, ...updatedAssignmentData }
              : assignment
          )
        );
        setSnackbar({
          open: true,
          message: "Assignment updated successfully",
          severity: "success",
        });
      } else {
        const newAssignmentResponse = await createAssignment(updatedAssignmentData);
        setAssignmentsList((prevList) => [...prevList, newAssignmentResponse]);
        setSnackbar({
          open: true,
          message: "Assignment added successfully",
          severity: "success",
        });
      }

      setDialogOpen(false);
      setNewAssignment({ name: "", s_id: "", due_date: new Date().toISOString().split("T")[0] });
      setEditMode(false);
      setAssignmentToEdit(null);
    } catch (error) {
      console.error("Error adding/updating assignment:", error);
      setSnackbar({
        open: true,
        message: "Failed to add/update assignment",
        severity: "error",
      });
    }
  };

  const handleEdit = (assignment) => {
    setNewAssignment({
      name: assignment.name,
      s_id: assignment.s_id._id,
      due_date: assignment.due_date.split("T")[0],
    });
    setEditMode(true);
    setAssignmentToEdit(assignment);
    setDialogOpen(true);
  };

  const handleDelete = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;

    try {
      await deleteAssignment(assignmentId);
      setAssignmentsList((prevList) =>
        prevList.filter((assignment) => assignment._id !== assignmentId)
      );
      setSnackbar({
        open: true,
        message: "Assignment deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting assignment:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete assignment",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ padding: 4, minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <Typography variant="h4" gutterBottom>
        Assignments
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setDialogOpen(true);
          setNewAssignment({ name: "", s_id: newAssignment.s_id, due_date: new Date().toISOString().split("T")[0] });
          setEditMode(false);
          setAssignmentToEdit(null);
        }}
        sx={{ marginBottom: 3 }}
      >
        Add New Assignment
      </Button>

      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ marginBottom: 2 }}
      >
        {subjects.map((subject) => (
          <Tab key={subject._id} label={subject.subjectTitle} />
        ))}
      </Tabs>

      {subjects.map((subject, index) => (
        <Box
          key={subject._id}
          role="tabpanel"
          hidden={selectedTab !== index}
          id={`tabpanel-${index}`}
          aria-labelledby={`tab-${index}`}
        >
          {selectedTab === index && (
            <Box>
              <Typography variant="h5" gutterBottom>
                {subject.subjectTitle} Assignments
              </Typography>
              {getAssignmentsForSubject(subject._id).length > 0 ? (
                <TableContainer
                  component={Paper}
                  elevation={3}
                  sx={{ marginTop: 2 }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Name</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Due Date</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Actions</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getAssignmentsForSubject(subject._id).map(
                        (assignment) => (
                          <TableRow key={assignment._id}>
                            <TableCell>{assignment.name}</TableCell>
                            <TableCell>
                              {assignment.due_date
                                ? new Date(
                                    assignment.due_date
                                  ).toLocaleDateString()
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => handleEdit(assignment)}
                                color="primary"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDelete(assignment._id)}
                                color="secondary"
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>
                  No assignments for {subject.subjectTitle}.
                </Typography>
              )}
            </Box>
          )}
        </Box>
      ))}

      {/* Dialog for Adding/Editing Assignment */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editMode ? "Edit Assignment" : "Add New Assignment"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Assignment Name"
            name="name"
            value={newAssignment.name}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <Box>
            <Autocomplete
              options={subjects}
              getOptionLabel={(option) => option.subjectTitle || ""}
              value={
                subjects.find(
                  (subject) => subject._id === newAssignment.s_id
                ) || null
              }
              onChange={(event, newValue) => {
                setNewAssignment({
                  ...newAssignment,
                  s_id: newValue ? newValue._id : "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Subject"
                  name="s_id"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
              )}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              fullWidth
              sx={{ width: "100%" }}
            />
          </Box>
          <TextField
            label="Due Date"
            name="due_date"
            type="date"
            value={newAssignment.due_date}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddAssignment} color="primary">
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AssignmentsPage;
