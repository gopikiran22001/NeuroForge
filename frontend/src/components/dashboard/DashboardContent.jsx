import api from "../../services/api";
import "./Dashboard.css";
import StatsCard from "./StatsCard";
import { useState,useEffect } from "react";

function DashboardContent() {

    const[users,setUsers] = useState([]);
    const[projects,setProjects] = useState([]);
    const[teams,setTeams] = useState([]);
    const[sprints,setSprints] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const users = await api.get("/users")
                const projects = await api.get("/projects")
                const teams = await api.get("/teams")
                const sprints = await api.get("/sprints")
                
                setUsers(users.data.data.content)
                setProjects(projects.data.data.content)
                setTeams(teams.data.data.content)
                setSprints(sprints.data.data.content)
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };
        fetchDashboardData();
    }, []);

    // console.log(users,projects,teams,sprints)

    return (
        <div className="dashboard-content">

            <div className="stats-grid">

                <StatsCard title="Projects" value={projects.length} />

                <StatsCard title="Users" value={users.length} />

                <StatsCard title="Teams" value={teams.length} />

                <StatsCard title="Sprints" value={sprints.length} />

            </div>

            <div className="dashboard-panel">

                <h2>Milestone 1</h2>

                <p>Project & User Management Dashboard</p>

                <p>
                    This dashboard will provide quick access to Users,
                    Projects, Teams, Sprints and Milestones.
                </p>

            </div>

        </div>
    );
}

export default DashboardContent;