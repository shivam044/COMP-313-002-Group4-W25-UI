import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, CircularProgress } from "@mui/material";
import { PeopleAlt, School, Assignment } from "@mui/icons-material";
import { getAllUsers } from "../../api/user";
import { getAllSubjects } from "../../api/subject";
import { getAllAssignments } from "../../api/assignment";

function AdminSystemAnalytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    students: 0,
    advisors: 0,
    admins: 0,
    totalSubjects: 0,
    totalAssignments: 0,
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch user roles
      const users = await getAllUsers();
      const students = users.filter((user) => user.role === "student").length;
      const advisors = users.filter((user) => user.role === "advisor").length;
      const admins = users.filter((user) => user.role === "admin").length;

      // Fetch total subjects & assignments
      const subjects = await getAllSubjects();
      const assignments = await getAllAssignments();

      setAnalytics({
        students,
        advisors,
        admins,
        totalSubjects: subjects.length,
        totalAssignments: assignments.length,
      });
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        System Usage Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Active Users by Role */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, display: "flex", alignItems: "center" }}>
            <PeopleAlt sx={{ fontSize: 40, color: "#0088FE", mr: 2 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Students</Typography>
              <Typography variant="h4">{analytics.students}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, display: "flex", alignItems: "center" }}>
            <PeopleAlt sx={{ fontSize: 40, color: "#00C49F", mr: 2 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Advisors</Typography>
              <Typography variant="h4">{analytics.advisors}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, display: "flex", alignItems: "center" }}>
            <PeopleAlt sx={{ fontSize: 40, color: "#FFBB28", mr: 2 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Admins</Typography>
              <Typography variant="h4">{analytics.admins}</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Total Subjects */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ p: 3, display: "flex", alignItems: "center" }}>
            <School sx={{ fontSize: 40, color: "#A259FF", mr: 2 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Total Subjects</Typography>
              <Typography variant="h4">{analytics.totalSubjects}</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Total Assignments */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ p: 3, display: "flex", alignItems: "center" }}>
            <Assignment sx={{ fontSize: 40, color: "#FF5733", mr: 2 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Total Assignments</Typography>
              <Typography variant="h4">{analytics.totalAssignments}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminSystemAnalytics;
