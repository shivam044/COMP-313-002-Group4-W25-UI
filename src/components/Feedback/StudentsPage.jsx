import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Stack
} from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";
import { getAllUsers } from "../../api/user";
import { scheduleMeeting } from "../../api/event";
import { useNavigate } from "react-router-dom";
import decodeToken from "../../helpers/decodeToken";

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [advisorId, setAdvisorId] = useState(null);
  const [meetingData, setMeetingData] = useState({
    title: "Academic Advising Session",
    description: "",
    date: "",
    time: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const navigate = useNavigate();

  // Time slots
  const availableTimeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"
  ];

  useEffect(() => {
    // Get advisor ID from token
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = decodeToken(token);
      setAdvisorId(decodedToken?.userId);
    }
    
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      const users = await getAllUsers();
      const studentUsers = users.filter(user => user.role === "student");
      setStudents(studentUsers);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudent = (studentId) => {
    navigate(`/student/${studentId}/performance`);
  };

  const handleOpenScheduleDialog = (student) => {
    setSelectedStudent(student);
    setOpenDialog(true);
    // Reset meeting data with default title
    setMeetingData({
      title: "Academic Advising Session",
      description: "",
      date: "",
      time: ""
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeetingData({
      ...meetingData,
      [name]: value
    });
  };

  const handleScheduleMeeting = async () => {
    if (!selectedStudent || !advisorId) return;
    
    setIsSubmitting(true);
    
    try {
      // Format date for API
      const dateObj = new Date(meetingData.date);
      
      // Prepare meeting data object
      const apiMeetingData = {
        name: meetingData.title,
        description: meetingData.description,
        date: dateObj,
        time: meetingData.time,
        duration: 30, // Default duration in minutes
        advisorId: advisorId,
        studentId: selectedStudent._id
      };
      
      // Call the API to schedule the meeting
      await scheduleMeeting(apiMeetingData);
      
      // Show success message
      setSnackbar({
        open: true,
        message: `Meeting scheduled with ${selectedStudent.firstName} ${selectedStudent.lastName}`,
        severity: "success"
      });
      
      // Close the dialog
      handleCloseDialog();
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      setSnackbar({
        open: true,
        message: "Failed to schedule meeting",
        severity: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
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
        Students
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: 3,
        }}
      >
        {students.map((student) => (
          <Card key={student._id} sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6">
                {student.firstName} {student.lastName}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {student.email}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewStudent(student._id)}
                >
                  View Performance
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<CalendarMonth />}
                  onClick={() => handleOpenScheduleDialog(student)}
                >
                  Schedule Meeting
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Meeting Scheduler Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          Schedule Meeting with {selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : "Student"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Meeting Title"
            fullWidth
            variant="outlined"
            value={meetingData.title}
            onChange={handleInputChange}
            required
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description (Optional)"
            fullWidth
            variant="outlined"
            value={meetingData.description}
            onChange={handleInputChange}
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="date"
            label="Date"
            type="date"
            fullWidth
            variant="outlined"
            value={meetingData.date}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            required
            inputProps={{
              min: new Date().toISOString().split('T')[0] // Prevents selecting past dates
            }}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth required sx={{ mb: 2 }}>
            <InputLabel id="time-select-label">Time</InputLabel>
            <Select
              labelId="time-select-label"
              name="time"
              value={meetingData.time}
              onChange={handleInputChange}
              label="Time"
            >
              {availableTimeSlots.map(time => (
                <MenuItem key={time} value={time}>{time}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleScheduleMeeting} 
            color="primary" 
            variant="contained"
            disabled={isSubmitting || !meetingData.title || !meetingData.date || !meetingData.time}
          >
            {isSubmitting ? "Scheduling..." : "Schedule Meeting"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default StudentsPage;