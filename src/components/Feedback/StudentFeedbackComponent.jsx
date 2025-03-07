import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  Collapse,
  Rating,
  Divider,
  Chip,
  Paper,
  IconButton,
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

/**
 * Component for displaying feedback for a subject or assignment
 * 
 * @param {Object} props
 * @param {Array} props.feedbackItems - Array of feedback objects to display
 * @param {string} props.type - Type of entity feedback is for ('subject' or 'assignment')
 * @param {string} props.id - ID of the entity feedback is for
 * @param {boolean} props.compact - If true, render in a more compact format
 * @returns {JSX.Element}
 */
const StudentFeedbackComponent = ({ feedbackItems = [], type = 'subject', id, compact = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // If no feedback items, return null
  if (!feedbackItems || feedbackItems.length === 0) {
    return compact ? (
      <Typography variant="body2" color="text.secondary">No feedback</Typography>
    ) : null;
  }
  
  const feedbackCount = feedbackItems.length;
  
  const handleToggle = () => {
    setIsExpanded(prev => !prev);
  };
  
  return (
    <Box sx={{ mt: compact ? 0 : 1, mb: compact ? 0 : 1 }}>
      <Box 
        onClick={handleToggle}
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer',
          p: compact ? 0.5 : 1,
          borderRadius: 1,
          '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
        }}
      >
        <CommentIcon color="primary" fontSize={compact ? "small" : "medium"} sx={{ mr: 1 }} />
        <Typography variant={compact ? "caption" : "body2"} color="primary">
          {feedbackCount} {feedbackCount === 1 ? 'Feedback' : 'Feedbacks'} 
        </Typography>
        {isExpanded ? 
          <ExpandLess fontSize={compact ? "small" : "medium"} sx={{ ml: 'auto' }} /> : 
          <ExpandMore fontSize={compact ? "small" : "medium"} sx={{ ml: 'auto' }} />
        }
      </Box>
      
      <Collapse in={isExpanded} timeout="auto">
        <List disablePadding sx={{ 
          maxHeight: compact ? '200px' : '400px', 
          overflowY: 'auto', 
          mt: 1,
          border: compact ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: 1,
          bgcolor: 'background.paper'
        }}>
          {feedbackItems.map((feedbackItem, index) => (
            <React.Fragment key={feedbackItem._id || index}>
              <ListItem 
                sx={{ 
                  flexDirection: 'column', 
                  alignItems: 'flex-start',
                  p: compact ? 1 : 2,
                }}
              >
                <Box sx={{ 
                  width: '100%', 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mb: 0.5
                }}>
                  <Typography variant="caption" color="textSecondary">
                    From: {feedbackItem.advisor_id ? 
                      `${feedbackItem.advisor_id.firstName} ${feedbackItem.advisor_id.lastName}` : 
                      'Advisor'}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(feedbackItem.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
                
                <Typography variant="body2" sx={{ mb: 0.5, whiteSpace: 'pre-wrap' }}>
                  {feedbackItem.feedback_text}
                </Typography>
                
                {feedbackItem.rating > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <Rating 
                      value={feedbackItem.rating} 
                      readOnly 
                      size="small"
                    />
                  </Box>
                )}
              </ListItem>
              {index < feedbackItems.length - 1 && (
                <Divider component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

export default StudentFeedbackComponent;