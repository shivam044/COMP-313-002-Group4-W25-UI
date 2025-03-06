import { createNotification } from '../api/notification'; 

/**
 * Sends a notification to a user.
 * @param {Object} params
 * @param {string} params.userId - User ID who will receive the notification.
 * @param {string} params.title - The title of the notification.
 * @param {string} params.message - The message body of the notification.
 * @param {string} [params.type='info'] - Type of the notification ('info', 'reminder', 'alert', 'success').
 */
export const sendNotification = async ({ userId, title, message, type = 'info' }) => {
    try {
      const notificationData = {
        uid: userId,
        title,
        message,
        type,
      };
      await createNotification(notificationData);
      console.log("Notification sent successfully:", title);
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };


//Example Usage

// When an assignment is due soon:
// const userId = assignment.uid;
// const title = "Assignment Reminder";
// const message = `Don't forget! Your assignment "${assignment.name}" is due on ${moment(assignment.due_date).format('YYYY-MM-DD')}.`;
// sendNotification({ userId, title, message, type: 'reminder' });