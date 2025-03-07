import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  LinearProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  Alert,
  AccordionDetails,
  AccordionSummary,
  Dialog,
  DialogTitle,
  Snackbar,
  DialogContent,
  DialogActions,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CommentIcon from '@mui/icons-material/Comment';
import { getFeedbackByAssignment, getFeedbackBySubject } from "../api/feedback";
import FeedbackModal from "../components/Feedback/FeedbackModal";
import {
  createGrade,
  getAllGrades,
  updateGrade,
  deleteGrade,
  getGradesByUser,
} from "../api/grade";
import {
  getSubjectsByUser,
} from "../api/subject";
import {
  getAssignmentsByUser,
} from "../api/assignment";
import decodeToken from "../helpers/decodeToken";

function GradesPage() {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [assignmentsList, setAssignmentsList] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [newGrade, setNewGrade] = useState({
    grade: "",
    outOf: "",
    s_id: "",
    a_id: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [gradeToEdit, setGradeToEdit] = useState(null);
  const [feedbackData, setFeedbackData] = useState({
    subjects: {},
    assignments: {}
  });
  
  const [feedbackModal, setFeedbackModal] = useState({
    open: false,
    entityId: null,
    entityName: "",
    entityType: "",
    items: [],
    loading: false
  });

  const handleOpenFeedbackModal = (entityId, entityType, entityName) => {
    let feedbackItems = [];
    
    // Get feedback from the already-loaded feedback data
    if (entityType === "subject" && feedbackData.subjects) {
      feedbackItems = feedbackData.subjects[entityId] || [];
    } else if (entityType === "assignment" && feedbackData.assignments) {
      feedbackItems = feedbackData.assignments[entityId] || [];
    }
    
    setFeedbackModal({
      open: true,
      entityId,
      entityName,
      entityType,
      items: feedbackItems,
      loading: false
    });
  };
  
  const handleCloseFeedbackModal = () => {
    setFeedbackModal({
      open: false,
      entityId: null,
      entityName: "",
      entityType: "",
      items: [],
      loading: false
    });
  };

  useEffect(() => {
    fetchSubjectsAndAssignmentsAndGrades();
  }, []);

  const fetchSubjectsAndAssignmentsAndGrades = async () => {
    try {
      if (!token) throw new Error("No token found");
      const decodedToken = decodeToken(token);
      const userId = decodedToken?.userId;

      const [subjects, assignments, grades] = await Promise.all([
        getSubjectsByUser(userId),
        getAssignmentsByUser(userId),
        getGradesByUser(userId),
      ]);


      const updatedSubjects = subjects.map((subject) => {
        const filteredAssignments = assignments.filter(
          (assignment) => assignment.s_id && assignment.s_id._id === subject._id
        );

        const gradesForSubject = grades.filter(
          (grade) => grade.s_id && grade.s_id._id === subject._id
        );

        const totalAchieved = gradesForSubject.reduce(
          (sum, grade) => sum + grade.grade,
          0
        );
        const totalOutOf = gradesForSubject.reduce(
          (sum, grade) => sum + grade.outOf,
          0
        );
        const totalLose = totalOutOf - totalAchieved;

        return {
          ...subject,
          totalAssignments: filteredAssignments.length,
          totalAchieved: totalAchieved,
          totalLose: totalLose,
          totalOutOf: totalOutOf,
        };
      });

      setSubjects(updatedSubjects);

      const updatedAssignmentList = assignments.map((assignment) => {
        const grade = grades.find(
          (grade) => grade.a_id && grade.a_id._id === assignment._id
        );

        return {
          ...assignment,
          grade: grade || null,
        };
      });

      setAssignmentsList(updatedAssignmentList);
      await fetchFeedbackData(updatedSubjects, updatedAssignmentList);
    } catch (error) {
      console.error("Error fetching data:", error);
      showSnackbar("Failed to fetch data.", "error");
    } finally {
      setLoading(false);
    }
  };

  
  const fetchFeedbackData = async (subjectsList, assignmentsList) => {
    try {
      // Ensure we have subjects and assignments before proceeding
      if (!subjectsList.length || !assignmentsList.length) {
        console.log("No subjects or assignments loaded yet, skipping feedback fetch");
        return;
      }
      
      // Fetch feedback for each subject
      const subjectFeedbackMap = {};
      for (const subject of subjectsList) {
        if (!subject || !subject._id) continue; // Skip if subject is invalid
        
        try {
          const feedback = await getFeedbackBySubject(subject._id);
          subjectFeedbackMap[subject._id] = feedback || [];
        } catch (subjectError) {
          console.error(`Error fetching feedback for subject ${subject._id}:`, subjectError);
          subjectFeedbackMap[subject._id] = []; // Initialize with empty array on error
        }
      }
      
      // Fetch feedback for each assignment
      const assignmentFeedbackMap = {};
      for (const assignment of assignmentsList) {
        if (!assignment || !assignment._id) continue; // Skip if assignment is invalid
        
        try {
          const feedback = await getFeedbackByAssignment(assignment._id);
          assignmentFeedbackMap[assignment._id] = feedback || [];
        } catch (assignmentError) {
          console.error(`Error fetching feedback for assignment ${assignment._id}:`, assignmentError);
          assignmentFeedbackMap[assignment._id] = []; // Initialize with empty array on error
        }
      }
      
      setFeedbackData({
        subjects: subjectFeedbackMap,
        assignments: assignmentFeedbackMap
      });
    } catch (error) {
      console.error("Error fetching feedback data:", error);
      // Initialize with empty objects on overall error
      setFeedbackData({
        subjects: {},
        assignments: {}
      });
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleInputChange = (e) => {
    setNewGrade({ ...newGrade, [e.target.name]: e.target.value });
  };

  const handleAddGrade = async () => {
    if (!newGrade.grade || !newGrade.outOf) {
      setSnackbar({
        open: true,
        message: "Grade and Out of Grade are required",
        severity: "error",
      });
      return;
    }

    if (parseFloat(newGrade.grade) > parseFloat(newGrade.outOf)) {
      setSnackbar({
        open: true,
        message: "Grade cannot be greater than the Out of Grade",
        severity: "error",
      });
      return;
    }

    const decodedToken = decodeToken(token);
    const userId = decodedToken?.userId;

    const updatedGradeData = {
      ...newGrade,
      notes: "",
      uid: userId,
    };

    try {
      if (editMode) {
        await updateGrade(gradeToEdit._id, updatedGradeData);
        showSnackbar("Grade updated successfully", "success");
      } else {
        await createGrade(updatedGradeData);
        showSnackbar("Grade added successfully", "success");
      }

      setDialogOpen(false);
      setNewGrade({ grade: 0, outOf: 0, s_id: "", a_id: "" });
      setEditMode(false);
      setGradeToEdit(null);
      fetchSubjectsAndAssignmentsAndGrades();
    } catch (error) {
      console.error("Error adding/updating grade:", error);
      showSnackbar("Failed to add/update grade", "error");
    }
  };

  const getAssignmentsForSubject = (subjectId) => {
    return assignmentsList.filter(
      (assignment) => assignment.s_id && assignment.s_id._id === subjectId
    );
  };

  return (
    <Box
      sx={{
        padding: 4,
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        overflowY: "auto",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Grades
      </Typography>

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

                {/* Add Feedback Button */}
                <Button 
                  variant="text" 
                  color="primary"
                  size="small"
                  onClick={() => handleOpenFeedbackModal(
                    subject._id, 
                    "subject", 
                    subject.subjectTitle
                  )}
                  startIcon={<CommentIcon />}
                >
                  Feedback
                  {feedbackData.subjects && 
                  feedbackData.subjects[subject._id] && 
                  feedbackData.subjects[subject._id].length > 0 && 
                  ` (${feedbackData.subjects[subject._id].length})`}
                </Button>  

              <Box
                sx={{
                  fontSize: "var(--small)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Box
                  sx={{
                    height: "8px",
                    width: "20px",
                    background: "#f4c430",
                    borderRadius: "5px",
                  }}
                />
                <p></p>Target: <b>{subject.targetGrade}%</b>
              </Box>
            </Box>

            <Box
              sx={{
                overflow: "hidden",
                marginY: 2,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  height: 40,
                  width: "100%",
                  backgroundColor: "#e7f1e8",
                  overflow: "hidden",
                  borderRadius: "5px",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    height: "100%",
                    width: `${subject.totalOutOf}%`,
                    backgroundColor: "#c6e5ff",
                    transition: "0.3s",
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    height: "15px",
                    width: `${subject.targetGrade}%`,
                    backgroundColor: "#f4c430",
                    zIndex: 10,
                    transition: "0.3s",
                    top: "50%",
                    transform: "translate(0, -50%)",
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    height: "100%",
                    width: `${subject.totalAchieved}%`,
                    backgroundColor: "#77dd76",
                    transition: "0.3s",
                    zIndex: 10,
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    height: "100%",
                    width: `${subject.totalLose}%`,
                    backgroundColor: "#ff6962",
                    right: 0,
                    transition: "0.3s",
                  }}
                />
              </Box>
            </Box>

            <Accordion
              sx={{
                boxShadow: "none",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  "& .MuiAccordionSummary-expandIconWrapper": {
                    alignSelf: "flex-end",
                  },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: { md: "10px", lg: "20px" },
                      width: "100%",
                      marginBottom: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{ fontSize: "var(--small)", width: "100%" }}
                    >
                      <Box
                        sx={{
                          height: "8px",
                          width: "20px",
                          background: "#77dd76",
                          borderRadius: "5px",
                          display: "inline-block",
                          marginRight: "8px",
                        }}
                      />
                      Achieved <b>{subject.totalAchieved}%</b>
                    </Typography>

                    <Typography
                      variant="body2"
                      component="span"
                      sx={{
                        fontSize: "var(--small)",
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          height: "8px",
                          width: "20px",
                          background: "#c6e5ff",
                          borderRadius: "5px",
                          display: "inline-block",
                          marginRight: "8px",
                        }}
                      />
                      Done <b>{subject.totalLose}%</b>
                    </Typography>

                    <Typography
                      variant="body2"
                      component="span"
                      sx={{
                        fontSize: "var(--small)",
                        textAlign: "right",
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          height: "8px",
                          width: "20px",
                          background: "#ff6962",
                          borderRadius: "5px",
                          display: "inline-block",
                          marginRight: "8px",
                        }}
                      />
                      Lose <b>{subject.totalLose}%</b>
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      marginTop: 1,
                      color: "#808080",
                    }}
                  >
                    <b
                      style={{
                        color: "#000",
                      }}
                    >
                      {subject.totalAssignments}
                    </b>{" "}
                    Assignments
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {getAssignmentsForSubject(subject._id).length > 0 ? (
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Name</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Due Date</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Achieved</strong>
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
                              {assignment.grade ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1,
                                  }}
                                >
                                  <span>
                                    {assignment.grade.grade}/
                                    {assignment.grade.outOf}
                                  </span>
                                  <LinearProgress
                                    variant="determinate"
                                    value={
                                      (assignment.grade.grade * 100) /
                                      assignment.grade.outOf
                                    }
                                    sx={{
                                      height: 20,
                                      width: "80px",
                                      borderRadius: "5px",
                                      backgroundColor: "#ff6962",
                                      "& .MuiLinearProgress-bar": {
                                        backgroundColor: "#77dd76",
                                      },
                                    }}
                                  />
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography variant="body2">
                                    Not Graded
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    aria-label="Add grade"
                                    onClick={() => {
                                      setDialogOpen(true);
                                      setNewGrade({
                                        grade: 0,
                                        outOf: 0,
                                        s_id: subject._id,
                                        a_id: assignment._id,
                                      });
                                      setEditMode(false);
                                      setGradeToEdit(null);
                                    }}
                                    sx={{
                                      backgroundColor: "#e7f1e8",
                                      "&:hover": { backgroundColor: "#d5e8d4" },
                                    }}
                                  >
                                    <AddIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="text"
                                color="primary"
                                size="small"
                                onClick={() => handleOpenFeedbackModal(
                                  assignment._id,
                                  "assignment",
                                  assignment.name
                                )}
                              >
                                View
                                {feedbackData.assignments && 
                                feedbackData.assignments[assignment._id] && 
                                feedbackData.assignments[assignment._id].length > 0 && 
                                ` (${feedbackData.assignments[assignment._id].length})`}
                              </Button>
                            </TableCell>

                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography>
                    No assignments for {subject.subjectTitle}.
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          </Box>
        ))}
      </Box>
      {/* Feedback Modal */}
      <FeedbackModal
        open={feedbackModal.open}
        onClose={handleCloseFeedbackModal}
        feedbackItems={feedbackModal.items}
        entityName={feedbackModal.entityName}
        entityType={feedbackModal.entityType}
        loading={feedbackModal.loading}
      />
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editMode ? "Edit Grade" : "Add New Grade"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Grade"
            name="grade"
            type="number"
            value={newGrade.grade}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Out of Grade"
            name="outOf"
            type="number"
            value={newGrade.outOf}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddGrade} color="primary">
            {editMode ? "Update" : "Grade"}
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

export default GradesPage;
