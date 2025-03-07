import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Tooltip,
  Fab,
} from "@mui/material";
import { Add, Event } from "@mui/icons-material";
import {
  getAssignmentsByUser,
  updateAssignment,
  deleteAssignment,
} from "../api/assignment";
import { getUserMeetings } from "../api/event";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import decodeToken from "../helpers/decodeToken";

const localizer = momentLocalizer(moment);

function AgendaPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [eventData, setEventData] = useState({ name: "", due_date: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [isAdvisor, setIsAdvisor] = useState(false);
  const [userId, setUserId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const decodedToken = decodeToken(token);
    setUserId(decodedToken?.userId);
    
    // Check if user is an advisor (you'll need to modify this based on your user roles system)
    setIsAdvisor(decodedToken?.role === "advisor" || decodedToken?.isAdvisor === true);
    
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      if (!token) throw new Error("No token found");
      const decodedToken = decodeToken(token);
      const userId = decodedToken?.userId;
      
      // Get assignments
      const assignments = await getAssignmentsByUser(userId);
      const formattedAssignments = assignments.map((assignment) => ({
        title: assignment.name,
        start: moment(assignment.due_date).toDate(),
        end: moment(assignment.due_date).toDate(),
        id: assignment._id,
        type: "assignment"
      }));
      
      // Get meetings
      const meetings = await getUserMeetings(userId);
      const formattedMeetings = meetings.map((meeting) => {
        // Create meeting date by combining date and time
        const meetingDate = new Date(meeting.date);
        if (meeting.time) {
          const [hours, minutes] = meeting.time.split(':');
          meetingDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
        }
        
        // Set end time based on duration (default to 30min)
        const endDate = new Date(meetingDate);
        endDate.setMinutes(endDate.getMinutes() + (meeting.duration || 30));
        
        // Get other participant name
        const otherPerson = meeting.related_id;
        const otherPersonName = otherPerson ? 
          `${otherPerson.firstName || ''} ${otherPerson.lastName || ''}` : 
          'Unknown';
          
        return {
          title: `${meeting.type}: ${meeting.name} with ${otherPersonName}`,
          start: meetingDate,
          end: endDate,
          id: meeting._id,
          type: "meeting",
          meeting: meeting
        };
      });
      
      // Combine all events
      setEvents([...formattedAssignments, ...formattedMeetings]);
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
    if (event.type === "assignment") {
      handleOpenDialog({ 
        name: event.title, 
        due_date: moment(event.start).format("YYYY-MM-DD"), 
        id: event.id 
      });
    } else if (event.type === "meeting") {
      // For meetings, you could show details or offer to cancel
      // This is a placeholder for future functionality
      showSnackbar(`Selected meeting: ${event.title}`, "info");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  const handleScheduleMeeting = () => {
    // For simplicity, we'll navigate to a list of students
    // In a real app, you might have a dialog to select a student first
    navigate("/students");
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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">
          Dashboard
        </Typography>
        
        {isAdvisor && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Event />}
            onClick={handleScheduleMeeting}
          >
            Schedule Meeting
          </Button>
        )}
      </Box>
      
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

      {/* Floating action button for mobile view */}
      {isAdvisor && (
        <Tooltip title="Schedule Meeting">
          <Fab 
            color="primary" 
            sx={{ position: 'fixed', bottom: 16, right: 16, display: { sm: 'none' } }}
            onClick={handleScheduleMeeting}
          >
            <Event />
          </Fab>
        </Tooltip>
      )}

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