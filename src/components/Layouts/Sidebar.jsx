import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUserById } from "../../api/user";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import SettingsIcon from "@mui/icons-material/Settings";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FeedbackIcon from "@mui/icons-material/Feedback";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"; 
import decodeToken from "../../helpers/decodeToken";
import "./css/sidebar.css";

function Sidebar() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        if (!token) throw new Error("Token not found");
        const decodedToken = decodeToken(token);
        const user = await getUserById(decodedToken.userId);
        setRole(user.role || "student"); // Fallback to 'student' if role is undefined
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-container">
        <div className="sidebar-links-container">
          <div className="sidebar-links-wrapper pad-t-3 pad-x-2 d-flex flex-direction-col gap-2">
            
            {/* Dashboard - Visible to All */}
            <Link
              className={`sidebar-link d-flex flex-direction-col aic pad-1 link-deco-none font-color-200 ${
                isActive("/dashboard") ? "active" : ""
              }`}
              to="/dashboard"
            >
              <div className="sidebar-link-icon">
                <DashboardIcon />
              </div>
              <div className="sidebar-link-text font-smaller">Dashboard</div>
            </Link>

            {/* Student Links */}
            {role === "student" && (
              <>
                <Link
                  className={`sidebar-link d-flex flex-direction-col aic pad-1 link-deco-none font-color-200 ${
                    isActive("/grades") ? "active" : ""
                  }`}
                  to="/grades"
                >
                  <div className="sidebar-link-icon">
                    <EqualizerIcon />
                  </div>
                  <div className="sidebar-link-text font-smaller">Grades</div>
                </Link>

                <Link
                  className={`sidebar-link d-flex flex-direction-col aic pad-1 link-deco-none font-color-200 ${
                    isActive("/assignments") ? "active" : ""
                  }`}
                  to="/assignments"
                >
                  <div className="sidebar-link-icon">
                    <AssignmentIcon />
                  </div>
                  <div className="sidebar-link-text font-smaller">Assignments</div>
                </Link>

                <Link
                  className={`sidebar-link d-flex flex-direction-col aic pad-1 link-deco-none font-color-200 ${
                    isActive("/subjects") ? "active" : ""
                  }`}
                  to="/subjects"
                >
                  <div className="sidebar-link-icon">
                    <LibraryBooksIcon />
                  </div>
                  <div className="sidebar-link-text font-smaller">Subjects</div>
                </Link>

                <Link
                  className={`sidebar-link d-flex flex-direction-col aic pad-1 link-deco-none font-color-200 ${
                    isActive("/teachers") ? "active" : ""
                  }`}
                  to="/teachers"
                >
                  <div className="sidebar-link-icon">
                    <LibraryBooksIcon />
                  </div>
                  <div className="sidebar-link-text font-smaller">Teachers</div>
                </Link>

                <Link
                  className={`sidebar-link d-flex flex-direction-col aic pad-1 link-deco-none font-color-200 ${
                    isActive("/semesters") ? "active" : ""
                  }`}
                  to="/semesters"
                >
                  <div className="sidebar-link-icon">
                    <LibraryBooksIcon />
                  </div>
                  <div className="sidebar-link-text font-smaller">Semesters</div>
                </Link>
              </>
            )}

            {/* Advisor Links */}
            {role === "advisor" && (
              <Link
                className={`sidebar-link d-flex flex-direction-col aic pad-1 link-deco-none font-color-200 ${
                  isActive("/feedback") ? "active" : ""
                }`}
                to="/feedback"
              >
                <div className="sidebar-link-icon">
                  <FeedbackIcon />
                </div>
                <div className="sidebar-link-text font-smaller">Feedback</div>
              </Link>
            )}

                {/* Admin Links */}
                {role === "admin" && (
                  <>
                    <Link
                      className={`sidebar-link d-flex flex-direction-col aic pad-1 link-deco-none font-color-200 ${
                        isActive("/admin/users") ? "active" : ""
                      }`}
                      to="/admin/users"
                    >
                      <div className="sidebar-link-icon">
                        <PeopleAltIcon />
                      </div>
                      <div className="sidebar-link-text font-smaller">Manage Users</div>
                    </Link>

                    <Link
                      className={`sidebar-link d-flex flex-direction-col aic pad-1 link-deco-none font-color-200 ${
                        isActive("/admin/stats") ? "active" : ""
                      }`}
                      to="/admin/stats"
                    >
                      <div className="sidebar-link-icon">
                        <PeopleAltIcon />
                      </div>
                      <div className="sidebar-link-text font-smaller">System Stats</div>
                    </Link>

                    <Link
                      className={`sidebar-link d-flex flex-direction-col aic pad-1 link-deco-none font-color-200 ${
                        isActive("/admin/policy") ? "active" : ""
                      }`}
                      to="/admin/policy"
                    >
                      <div className="sidebar-link-icon">
                        <PeopleAltIcon />
                      </div>
                      <div className="sidebar-link-text font-smaller">Policy Settings</div>
                    </Link>

                  </>
                )}

            {/* Common Links for All Roles */}
            <Link
              className={`sidebar-link d-flex flex-direction-col aic pad-1 link-deco-none font-color-200 ${
                isActive("/settings") ? "active" : ""
              }`}
              to="/settings"
            >
              <div className="sidebar-link-icon">
                <SettingsIcon />
              </div>
              <div className="sidebar-link-text font-smaller">Settings</div>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
