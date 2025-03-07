import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab
} from "@mui/material";

function PoliciesSettingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [gradingScale, setGradingScale] = useState("percentage");
  const [attendanceRequirement, setAttendanceRequirement] = useState(75);
  const [examDeadline, setExamDeadline] = useState("");

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        Institution Policies
      </Typography>

      {/* Tabs for different settings */}
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Grading Policy" />
        <Tab label="Attendance Policy" />
        <Tab label="Exam Deadlines" />
      </Tabs>

      {/* Content for Grading Policy */}
      {activeTab === 0 && (
        <Paper sx={{ padding: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Grading Scale
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Grading System</InputLabel>
            <Select
              value={gradingScale}
              onChange={(e) => setGradingScale(e.target.value)}
            >
              <MenuItem value="percentage">Percentage (0-100%)</MenuItem>
              <MenuItem value="letter">Letter Grades (A, B, C...)</MenuItem>
              <MenuItem value="gpa">GPA (4.0 Scale)</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Passing Grade (%)"
            type="number"
            value={50}
            disabled
            sx={{ mb: 2 }}
          />

          <Button variant="contained" color="primary">
            Save Policy
          </Button>
        </Paper>
      )}

      {/* Content for Attendance Policy */}
      {activeTab === 1 && (
        <Paper sx={{ padding: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Attendance Requirement
          </Typography>
          <TextField
            fullWidth
            label="Minimum Attendance (%)"
            type="number"
            value={attendanceRequirement}
            onChange={(e) => setAttendanceRequirement(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button variant="contained" color="primary">
            Save Policy
          </Button>
        </Paper>
      )}

      {/* Content for Exam Deadlines */}
      {activeTab === 2 && (
        <Paper sx={{ padding: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Exam Schedule & Deadlines
          </Typography>
          <TextField
            fullWidth
            label="Final Exam Deadline"
            type="date"
            value={examDeadline}
            onChange={(e) => setExamDeadline(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />

          <Button variant="contained" color="primary">
            Save Policy
          </Button>
        </Paper>
      )}
    </Box>
  );
}

export default PoliciesSettingsPage;
