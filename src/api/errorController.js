
export const handleApiError = (message, error) => {
    // Log the error to an external logging service or similar

    // Display a message to the UI or take appropriate actions
    console.error(`${message}:`, error.message);
  
    //Implement additional logic here, like notifying the user
    // alert(`${message}. Please try again later.`);
  };
  