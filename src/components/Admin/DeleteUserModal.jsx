import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from "@mui/material";

function DeleteUserModal({ open, handleClose, handleDelete, user }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete user "<strong>{user?.firstName} {user?.lastName}</strong>"?
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteUserModal;
