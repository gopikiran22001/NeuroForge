import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
    return (
        <div className="sidebar-container">
            <div className="sidebar-brand">
                <div className="sidebar-logo">N</div>
                <h2>NeuroForge</h2>
            </div>

            <div className="sidebar-divider" />

            <nav className="sidebar-menu">
                <NavLink to="/dashboard" className="sidebar-link">
                    Dashboard
                </NavLink>

                <NavLink to="/users" className="sidebar-link">
                    Users
                </NavLink>

                <NavLink to="/projects" className="sidebar-link">
                    Projects
                </NavLink>

                <NavLink to="/teams" className="sidebar-link">
                    Teams
                </NavLink>

                <NavLink to="/sprints" className="sidebar-link">
                    Sprints
                </NavLink>

                <NavLink to="/milestones" className="sidebar-link">
                    Milestones
                </NavLink>
            </nav>
        </div>
    );
}

export default Sidebar;