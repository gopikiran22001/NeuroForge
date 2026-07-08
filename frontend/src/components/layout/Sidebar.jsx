import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <div style={{
            width: "250px",
            background: "#1E293B",
            color: "white",
            height: "100vh",
            padding: "20px"
        }}>
            <h2>NeuroForge</h2>

            <hr />

            <NavLink to="/dashboard">Dashboard</NavLink>
            <br /><br />

            <NavLink to="/users">Users</NavLink>
            <br /><br />

            <NavLink to="/projects">Projects</NavLink>
            <br /><br />

            <NavLink to="/teams">Teams</NavLink>
            <br /><br />

            <NavLink to="/sprints">Sprints</NavLink>
            <br /><br />

            <NavLink to="/milestones">Milestones</NavLink>
        </div>
    );
}

export default Sidebar;