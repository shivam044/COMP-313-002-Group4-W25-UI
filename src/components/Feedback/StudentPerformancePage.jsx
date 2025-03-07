import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
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
    AccordionDetails,
    AccordionSummary,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert,
    Checkbox,
    FormControlLabel,
    Chip,
    Divider,
    IconButton,
    Tooltip,
    Rating,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChatIcon from "@mui/icons-material/Chat";
import CommentIcon from '@mui/icons-material/Comment';
import FeedbackIcon from "@mui/icons-material/Feedback";
import { getUserById } from "../../api/user";
import { getGradesByUser } from "../../api/grade";
import { getSubjectsByUser } from "../../api/subject";
import { getAssignmentsByUser } from "../../api/assignment";
import { createFeedback } from "../../api/feedback";
import decodeToken from "../../helpers/decodeToken";
import { getFeedbackByAssignment, getFeedbackBySubject } from "../../api/feedback";
import FeedbackModal from "./FeedbackModal";

function StudentPerformancePage() {
    const { studentId } = useParams();
    const token = localStorage.getItem("token");
    const [advisor, setAdvisor] = useState(null);
    const [student, setStudent] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedbackDialog, setFeedbackDialog] = useState({
        open: false,
        id: null,
        type: "",
        text: "",
        rating: 0
    });
    const [batchFeedbackDialog, setBatchFeedbackDialog] = useState({
        open: false,
        subjectId: null,
        text: "",
        rating: 0,
        assignments: []
    });
    const [role, setRole] = useState("student");
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
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
        loading: false,
        error: false
    });
    const handleOpenFeedbackModal = async (entityId, entityType, entityName) => {
        try {
            // Show loading state
            setFeedbackModal({
                open: true,
                entityId,
                entityName,
                entityType,
                items: [], // Empty array initially to show loading
                loading: true
            });
            
            // Fetch fresh feedback data directly
            let feedbackItems = [];
            try {
                if (entityType === "subject") {
                    feedbackItems = await getFeedbackBySubject(entityId);
                } else if (entityType === "assignment") {
                    feedbackItems = await getFeedbackByAssignment(entityId);
                }
            } catch (apiError) {
                // If it's a 404 error, just treat it as empty feedback (not an error)
                if (apiError.response && apiError.response.status === 404) {
                    feedbackItems = [];
                } else {
                    // For other errors, re-throw to be caught by the outer catch
                    throw apiError;
                }
            }
            
            // Update modal with fetched data
            setFeedbackModal(prev => ({
                ...prev,
                items: feedbackItems || [],
                loading: false
            }));
        } catch (error) {
            console.error(`Error fetching feedback for ${entityType}:`, error);
            // Set as empty feedback instead of error state
            setFeedbackModal(prev => ({
                ...prev,
                items: [],
                loading: false,
                // error: true  // We're not setting error state anymore
            }));
        }
    };
    const handleCloseFeedbackModal = () => {
        setFeedbackModal({
            open: false,
            entityId: null,
            entityName: "",
            entityType: "",
            items: []
        });
    };

    useEffect(() => {
        fetchUserRole();
        fetchStudentData();
    }, [studentId]);

    const fetchUserRole = async () => {
        try {
            if (!token) throw new Error("Token not found");
            const decodedToken = decodeToken(token);
            const user = await getUserById(decodedToken.userId);
            setRole(user.role || "student");
            if (user.role === "advisor") {
                setAdvisor(user);
            }
        } catch (error) {
            console.error("Error fetching user role:", error);
            showSnackbar("Error fetching user role", "error");
        }
    };

    const fetchFeedbackData = async () => {
        try {
          // Ensure we have subjects and assignments before proceeding
          if (!subjects.length || !assignments.length) {
            console.log("No subjects or assignments loaded yet, skipping feedback fetch");
            return;
          }
          
          // Fetch feedback for each subject
          const subjectFeedbackMap = {};
          for (const subject of subjects) {
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
          for (const assignment of assignments) {
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
          showSnackbar("Error fetching feedback data", "error");
          // Initialize with empty objects on overall error
          setFeedbackData({
            subjects: {},
            assignments: {}
          });
        }
    };

    const fetchStudentData = async () => {
        try {
            const studentData = await getUserById(studentId);
            const studentSubjects = await getSubjectsByUser(studentId);
            const studentAssignments = await getAssignmentsByUser(studentId);
            const studentGrades = await getGradesByUser(studentId);

            setStudent(studentData);
            setGrades(studentGrades);

            // Process subjects with grade data
            const updatedSubjects = studentSubjects.map((subject) => {
                const gradesForSubject = studentGrades.filter(
                    (grade) => {
                        if (typeof grade.s_id === 'string') {
                            return grade.s_id === subject._id;
                        } else if (grade.s_id && grade.s_id._id) {
                            return grade.s_id._id === subject._id;
                        }
                        return false;
                    }
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

                // Use the same robust filtering approach for counting assignments
                const subjectAssignments = studentAssignments.filter((assignment) => {
                    if (typeof assignment.s_id === 'string') {
                        return assignment.s_id === subject._id;
                    } else if (assignment.s_id && assignment.s_id._id) {
                        return assignment.s_id._id === subject._id;
                    }
                    return false;
                });

                return {
                    ...subject,
                    totalAssignments: subjectAssignments.length,
                    totalAchieved: totalAchieved,
                    totalLose: totalLose,
                    totalOutOf: totalOutOf,
                };
            });

            setSubjects(updatedSubjects);

            // Process assignments with grade data
            const updatedAssignments = studentAssignments.map((assignment) => {
                // Find grade for this assignment
                const grade = studentGrades.find((grade) => {
                    // Handle different formats of a_id
                    if (typeof grade.a_id === 'string') {
                        return grade.a_id === assignment._id;
                    } else if (grade.a_id && grade.a_id._id) {
                        return grade.a_id._id === assignment._id;
                    }
                    return false;
                });

                // Preserve the original s_id structure
                return {
                    ...assignment,
                    grade: grade || null,
                };
            });

            setAssignments(updatedAssignments);
            await fetchFeedbackData();
        } catch (error) {
            console.error("Error fetching student data:", error);
            showSnackbar("Error fetching student data", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenFeedbackDialog = (id, type) => {
        setFeedbackDialog({ open: true, id, type, text: "" });
    };

    const handleCloseFeedbackDialog = () => {
        setFeedbackDialog({ open: false, id: null, type: "", text: "" });
    };

    const handleOpenBatchFeedbackDialog = (subjectId) => {
        // Get all assignments for this subject
        const subjectAssignments = getAssignmentsForSubject(subjectId);

        // Initialize with all assignments checked
        const assignmentsWithSelection = subjectAssignments.map(assignment => ({
            ...assignment,
            selected: true
        }));

        setBatchFeedbackDialog({
            open: true,
            subjectId: subjectId,
            text: "",
            rating: 0,
            assignments: assignmentsWithSelection
        });
    };

    const handleCloseBatchFeedbackDialog = () => {
        setBatchFeedbackDialog({
            open: false,
            subjectId: null,
            text: "",
            rating: 0,
            assignments: []
        });
    };

    const handleAssignmentSelectionChange = (assignmentId, selected) => {
        setBatchFeedbackDialog(prev => ({
            ...prev,
            assignments: prev.assignments.map(assignment =>
                assignment._id === assignmentId
                    ? { ...assignment, selected }
                    : assignment
            )
        }));
    };

    const handleSubmitFeedback = async () => {
        try {
            if (!advisor) {
                showSnackbar("Only advisors can submit feedback", "error");
                return;
            }

            // Create feedback object based on the schema
            const feedbackData = {
                advisor_id: advisor._id,
                student_id: studentId,
                feedback_text: feedbackDialog.text,
                rating: feedbackDialog.rating || undefined, // Only include if rating was provided
            };

            // Add assignment_id or subject_id based on feedback type
            if (feedbackDialog.type === "assignment") {
                feedbackData.assignment_id = feedbackDialog.id;
            } else if (feedbackDialog.type === "subject") {
                feedbackData.subject_id = feedbackDialog.id;
            }

            await createFeedback(feedbackData);
            
            showSnackbar("Feedback submitted successfully!", "success");
            handleCloseFeedbackDialog();
        } catch (error) {
            console.error("Error submitting feedback:", error);
            showSnackbar("Error submitting feedback", "error");
        }
        await fetchFeedbackData();
    };

    const handleSubmitBatchFeedback = async () => {
        try {
            if (!advisor) {
                showSnackbar("Only advisors can submit feedback", "error");
                return;
            }

            // Create an array to track all feedback submission promises
            const feedbackPromises = [];

            // Add feedback for the subject
            const subjectFeedbackData = {
                advisor_id: advisor._id,
                student_id: studentId,
                subject_id: batchFeedbackDialog.subjectId,
                feedback_text: batchFeedbackDialog.text,
                rating: batchFeedbackDialog.rating || undefined, // Only include if rating was provided
            };

            feedbackPromises.push(createFeedback(subjectFeedbackData));

            // Add feedback for selected assignments
            const selectedAssignments = batchFeedbackDialog.assignments.filter(assignment => assignment.selected);

            for (const assignment of selectedAssignments) {
                const assignmentFeedbackData = {
                    advisor_id: advisor._id,
                    student_id: studentId,
                    assignment_id: assignment._id,
                    feedback_text: batchFeedbackDialog.text,
                    rating: batchFeedbackDialog.rating || undefined, // Only include if rating was provided
                };

                feedbackPromises.push(createFeedback(assignmentFeedbackData));
            }

            // Wait for all feedback to be submitted
            await Promise.all(feedbackPromises);
    
            showSnackbar(`Feedback submitted for subject and ${selectedAssignments.length} assignments!`, "success");
            handleCloseBatchFeedbackDialog();
        } catch (error) {
            console.error("Error submitting batch feedback:", error);
            showSnackbar("Error submitting batch feedback", "error");
        }
        await fetchFeedbackData();
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

    const getAssignmentsForSubject = (subjectId) => {
        return assignments.filter((assignment) => {
            // Handle case where s_id is a string
            if (typeof assignment.s_id === 'string') {
                return assignment.s_id === subjectId;
            }
            // Handle case where s_id is an object with _id property
            else if (assignment.s_id && assignment.s_id._id) {
                return assignment.s_id._id === subjectId;
            }
            return false;
        });
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <Typography variant="h6">Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 4, minHeight: "100vh", backgroundColor: "#f9f9f9", overflowY: "auto" }}>
            <Typography variant="h4" gutterBottom>
                {student.firstName} {student.lastName} - Academic Performance
            </Typography>

            <Box
                sx={{
                    padding: "20px",
                    columnCount: { md: 1, lg: 2, xl: 3 },
                    columnGap: { md: "20px", lg: "40px" },
                }}
            >
                {subjects.map((subject) => (
                    <Box
                        key={subject._id}
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

                                {/* Feedback Modal Button */}
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
                                <p></p>Target: <b>{subject.targetGrade || 70}%</b>
                            </Box>
                            {role === "advisor" && (
                                <Box sx={{ display: "flex", gap: 1, marginLeft: "auto" }}>
                                    <Tooltip title="Leave Feedback">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleOpenFeedbackDialog(subject._id, "subject")}
                                            color="primary"
                                        >
                                            <ChatIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Batch Feedback">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleOpenBatchFeedbackDialog(subject._id)}
                                            color="secondary"
                                        >
                                            <FeedbackIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            )}
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
                                        width: `${subject.totalOutOf || 0}%`,
                                        backgroundColor: "#c6e5ff",
                                        transition: "0.3s",
                                    }}
                                />

                                <Box
                                    sx={{
                                        position: "absolute",
                                        height: "15px",
                                        width: `${subject.targetGrade || 70}%`,
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
                                        width: `${subject.totalAchieved || 0}%`,
                                        backgroundColor: "#77dd76",
                                        transition: "0.3s",
                                        zIndex: 10,
                                    }}
                                />

                                <Box
                                    sx={{
                                        position: "absolute",
                                        height: "100%",
                                        width: `${subject.totalLose || 0}%`,
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
                                            Achieved <b>{subject.totalAchieved || 0}%</b>
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
                                            Done <b>{subject.totalOutOf || 0}%</b>
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
                                            Lose <b>{subject.totalLose || 0}%</b>
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
                                            {subject.totalAssignments || 0}
                                        </b>{" "}
                                        Assignments
                                    </Box>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                {getAssignmentsForSubject(subject._id).length > 0 ? (
                                    <TableContainer component={Paper}>
                                        <Table size="small" aria-label="assignments table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell><strong>Name</strong></TableCell>
                                                        <TableCell><strong>Due Date</strong></TableCell>
                                                        <TableCell><strong>Achieved</strong></TableCell>
                                                        <TableCell><strong>Feedback</strong></TableCell>
                                                        <TableCell><strong>Actions</strong></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                            <TableBody>
                                                {getAssignmentsForSubject(subject._id).map((assignment) => (
                                                    <TableRow key={assignment._id}>
                                                        <TableCell>{assignment.name}</TableCell>
                                                        <TableCell>
                                                            {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : "N/A"}
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
                                                                        {assignment.grade.grade}/{assignment.grade.outOf}
                                                                    </span>
                                                                    <LinearProgress
                                                                        variant="determinate"
                                                                        value={(assignment.grade.grade * 100) / assignment.grade.outOf}
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
                                                                <Typography variant="body2">Not Graded</Typography>
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

                                                        <TableCell>
                                                            {role === "advisor" && (
                                                                <Tooltip title="Leave Feedback">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleOpenFeedbackDialog(assignment._id, "assignment")}
                                                                        color="primary"
                                                                    >
                                                                        <ChatIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Typography>No assignments for {subject.subjectTitle}.</Typography>
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
                error={feedbackModal.error}
            />
            {/* Feedback Dialog */}
            <Dialog open={feedbackDialog.open} onClose={handleCloseFeedbackDialog} fullWidth maxWidth="sm">
                <DialogTitle>Leave Feedback</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Feedback"
                        fullWidth
                        multiline
                        rows={3}
                        value={feedbackDialog.text}
                        onChange={(e) => setFeedbackDialog({ ...feedbackDialog, text: e.target.value })}
                        sx={{ marginTop: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseFeedbackDialog} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmitFeedback} color="primary">Submit</Button>
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

export default StudentPerformancePage;