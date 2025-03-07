import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import { Search, Add, Edit, Delete, Refresh } from "@mui/icons-material";
import { getAllUsers, createUser, updateUser, deleteUser } from "../../api/user";
import UserFormModal from "../../components/Admin/UserFormModal";
import DeleteUserModal from "../../components/Admin/DeleteUserModal";

function AdminUserManagement() {
  // State
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // User Form Modal State
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("create"); // "create" or "edit"
  const [selectedUser, setSelectedUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    userName: "", 
    firstName: "",
    lastName: "",
    email: "",
    role: "student",
    password: "",
  });

  // Delete Confirmation Modal State
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Notification
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [search, roleFilter, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      showSnackbar("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (search.trim() !== "") {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(searchLower) ||
          user.lastName?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(searchLower)
      );
    }

    setFilteredUsers(filtered);
  };

  const openCreateDialog = () => {
    setDialogMode("create");
    setUserFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "student",
      password: "",
    });
    setOpenDialog(true);
  };

  const openEditDialog = (user) => {
    setDialogMode("edit");
    setSelectedUser(user);
    setUserFormData({
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      password: "",
    });
    setOpenDialog(true);
  };

  const openConfirmDelete = (user) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleCreateOrUpdateUser = async () => {
    try {
      if (dialogMode === "create") {
        await createUser(userFormData); 
        showSnackbar("User created successfully", "success");
      } else {
        await updateUser(selectedUser._id, userFormData);
        showSnackbar("User updated successfully", "success");
      }
      fetchUsers();
      setOpenDialog(false);
    } catch (error) {
      showSnackbar("Failed to process user", "error");
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(userToDelete._id);
      fetchUsers();
      showSnackbar("User deleted successfully", "success");
    } catch (error) {
      showSnackbar("Failed to delete user", "error");
    }
    setOpenDeleteDialog(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box sx={{ padding: 4, minHeight: "100vh" }}>
      <Typography variant="h4">User Management</Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search users..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" startIcon={<Refresh />} onClick={fetchUsers}>
          Refresh
        </Button>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={openCreateDialog}>
          Add User
        </Button>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow hover key={user._id}>
                    <TableCell>
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton color="primary" onClick={() => openEditDialog(user)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => openConfirmDelete(user)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
        />
      </Paper>

      {/* Modals */}
      <UserFormModal
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        handleSave={handleCreateOrUpdateUser}
        formData={userFormData}
        handleChange={(e) => setUserFormData({ ...userFormData, [e.target.name]: e.target.value })}
        mode={dialogMode}
      />

      <DeleteUserModal
        open={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        handleDelete={handleDeleteUser}
        user={userToDelete}
      />

      {/* Snackbar Notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminUserManagement;
