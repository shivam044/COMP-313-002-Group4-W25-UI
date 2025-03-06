import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.svg";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

import { getNotificationsByUser, markNotificationAsRead } from "../../api/notification";
import decodeToken from "../../helpers/decodeToken";
import "./css/topbar.css";

function DashboardPage() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const [profileAnchorEl, setProfileAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);

  React.useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      if (!token) throw new Error("No token found");
      const decodedToken = decodeToken(token);
      const userId = decodedToken?.userId;
  
      const fetchedNotifications = await getNotificationsByUser(userId);
      const unreadNotifications = fetchedNotifications.filter(notification => !notification.read);
      setNotifications(unreadNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      fetchNotifications(); // Refresh the notifications list
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const profileOpen = Boolean(profileAnchorEl);
  const profileId = profileOpen ? "profile-popover" : undefined;

  return (
    <div className="topbar pad-y-2 pad-x-4">
      <div className="topbar-content d-flex aic jcsb gap-2">
        <div className="logo">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="topbar-right-section d-flex jce aic flex-1 gap-2">
          {/* <div className="searchbar-container">
            <div className="searchbar-wrapper d-flex aic jcc pad-x-2">
              <input
                type="search"
                className="w-100 font-normal"
                placeholder="Search, Ex. page"
              />
              <SearchIcon className="font-color-200" />
            </div>
          </div> */}
          <div className="topbar-icons-container">
            <div className="topbar-icons-wrapper d-flex gap-1">
              <div
                aria-describedby={id}
                onClick={handleClick}
                className="topbar-icon cur-point font-color-200"
              >
                <NotificationsIcon />
              </div>

              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor: "var(--bg-200)",
                    borderRadius: "10px",
                    boxShadow: "0px 3px 10px rgba(0,0,0,0.2)",
                    padding: "10px",
                    width: "100%",
                    maxWidth: "600px",
                    marginTop: "var(--spacing-2)",
                  },
                }}
              >
                <Typography sx={{ p: "var(--spacing-2)" }}>
                  <b className="pad-l-1 font-color-200">Notifications</b>

                  <Box sx={{ width: "100%" }}>
                    <nav>
                      <List>
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <ListItem key={notification._id} disablePadding>
                              <ListItemButton
                                sx={{
                                  p: "0 var(--spacing-1)",
                                  marginBottom: "var(--spacing-1)",
                                }}
                              >
                                <ListItemText
                                  primary={notification.title}
                                  secondary={notification.message}
                                />
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleMarkAsRead(notification._id)}
                                  sx={{ marginLeft: 2 }}
                                >
                                  Mark as Read
                                </Button>
                              </ListItemButton>
                            </ListItem>
                          ))
                        ) : (
                          <Typography sx={{ p: "var(--spacing-2)", color: "var(--font-color-200)" }}>
                            No new notifications.
                          </Typography>
                        )}
                      </List>
                    </nav>
                  </Box>
                </Typography>
              </Popover>

              <div
                aria-describedby={profileId}
                onClick={handleProfileClick}
                className="topbar-icon cur-point font-color-200"
              >
                <AccountCircleIcon />
              </div>

              <Popover
                id={profileId}
                open={profileOpen}
                anchorEl={profileAnchorEl}
                onClose={handleProfileClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor: "var(--bg-200)",
                    borderRadius: "10px",
                    boxShadow: "0px 3px 10px rgba(0,0,0,0.2)",
                    padding: "10px",
                    width: "200px",
                    marginTop: "var(--spacing-2)",
                  },
                }}
              >
                <Box sx={{ p: "var(--spacing-2)" }}>
                  <Typography variant="body1" gutterBottom>
                    {decodedToken?.name || "User"}
                  </Typography>
                  <List>

                    <ListItem disablePadding>
                      <ListItemButton component={Link} to="/settings" sx={{ p: "var(--spacing-1)" }}>
                        <SettingsIcon sx={{ mr: 1 }} /> Settings
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton onClick={handleSignOut} sx={{ p: "var(--spacing-1)" }}>
                        <LogoutIcon sx={{ mr: 1 }} /> Sign Out
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Box>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
