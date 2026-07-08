import "./Dashboard.css";
import StatsCard from "./StatsCard";

function DashboardContent() {
    return (
        <div className="dashboard-content">

            <div className="stats-grid">

                <StatsCard title="Projects" value="10" />

                <StatsCard title="Users" value="25" />

                <StatsCard title="Teams" value="6" />

                <StatsCard title="Sprints" value="15" />

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