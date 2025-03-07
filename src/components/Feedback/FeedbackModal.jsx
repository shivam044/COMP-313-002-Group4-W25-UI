// FeedbackModal.js
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Rating,
  List,
  ListItem,
  CircularProgress
} from '@mui/material';

/**
 * Modal component for displaying feedback
 * 
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is open
 * @param {function} props.onClose - Function to call when closing the modal
 * @param {Array} props.feedbackItems - Array of feedback objects to display
 * @param {string} props.entityName - Name of the entity feedback is for (e.g., "Math 101" or "Homework 1")
 * @param {string} props.entityType - Type of entity feedback is for ('subject' or 'assignment')
 * @returns {JSX.Element}
 */
    const FeedbackModal = ({ 
        open, 
        onClose, 
        feedbackItems = [], 
        entityName = '', 
        entityType = 'subject',
        loading = false,
        error = false 
    }) => {
        if (loading) {
            return (
                <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                    <DialogTitle>Feedback for {entityName}</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    </DialogContent>
                </Dialog>
            );
        }
        
        if (error) {
            return (
                <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                    <DialogTitle>Feedback for {entityName}</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" color="error" sx={{ py: 4, textAlign: 'center' }}>
                            Error loading feedback. Please try again.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose} color="primary">Close</Button>
                    </DialogActions>
                </Dialog>
            );
        }
        
        if (!feedbackItems || feedbackItems.length === 0) {
            return (
                <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                    <DialogTitle>Feedback for {entityName}</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                            No feedback available for this {entityType}.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose} color="primary">Close</Button>
                    </DialogActions>
                </Dialog>
            );
        }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Feedback for {entityName}</DialogTitle>
      <DialogContent>
        <List sx={{ width: '100%' }}>
          {feedbackItems.map((feedback, index) => (
            <React.Fragment key={feedback._id || index}>
              <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', py: 2 }}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" color="primary">
                    {feedback.advisor_id ? 
                      `${feedback.advisor_id.firstName} ${feedback.advisor_id.lastName}` : 
                      'Advisor'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(feedback.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
                
                <Typography variant="body1" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
                  {feedback.feedback_text}
                </Typography>
                
                {feedback.rating > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Rating value={feedback.rating} readOnly />
                  </Box>
                )}
              </ListItem>
              {index < feedbackItems.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackModal;