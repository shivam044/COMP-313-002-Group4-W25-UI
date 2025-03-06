import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  getAssignmentsByUser,
  updateAssignment,
  deleteAssignment,
} from "../api/assignment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import decodeToken from "../helpers/decodeToken";

const localizer = momentLocalizer(moment);

function AgendaPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [eventData, setEventData] = useState({ name: "", due_date: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      if (!token) throw new Error("No token found");
      const decodedToken = decodeToken(token);
      const userId = decodedToken?.userId;
      const assignments = await getAssignmentsByUser(userId);
      const formattedAssignments = assignments.map((assignment) => ({
        title: assignment.name,
        start: moment(assignment.due_date).toDate(),
        end: moment(assignment.due_date).toDate(),
        id: assignment._id,
      }));
      setEvents(formattedAssignments);
    } catch (error) {
      console.error("Error fetching events:", error);
      showSnackbar("Failed to fetch events.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (event = null) => {
    setEditMode(!!event);
    setEventData(event || { name: "", due_date: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setEventData({ name: "", due_date: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveEvent = async () => {
    try {
      const decodedToken = decodeToken(token);
      const userId = decodedToken?.userId;

      const requestData = {
        ...eventData,
        uid: userId,
      };

      if (editMode) {
        await updateAssignment(eventData.id, requestData);
        showSnackbar("Event updated successfully!", "success");
      } else {
        // Future functionality for creating new events like reminders/exams can be added here
        showSnackbar("Event added successfully!", "success");
      }
      fetchEvents();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving event:", error);
      showSnackbar("Failed to save event.", "error");
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await deleteAssignment(id);
      showSnackbar("Event deleted successfully!", "success");
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      showSnackbar("Failed to delete event.", "error");
    }
  };

  const handleEventSelect = (event) => {
    handleOpenDialog({ name: event.title, due_date: moment(event.start).format("YYYY-MM-DD"), id: event.id });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
        Dashboard
      </Typography>
      <Box style={{ height: "80vh" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          selectable={true}
          onSelectEvent={handleEventSelect}
        />
      </Box>

      {/* Dialog for Editing an Event */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editMode ? "Edit Event" : "Add New Event"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Event Name"
            name="name"
            fullWidth
            value={eventData.name}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Due Date"
            name="due_date"
            type="date"
            fullWidth
            value={eventData.due_date}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEvent} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
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

export default AgendaPage;
