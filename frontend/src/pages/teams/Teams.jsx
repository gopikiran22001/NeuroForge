import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getTeams, createTeam, updateTeam, deleteTeam } from "../../services/teamService";
import Modal from "../../components/common/Modal";
import TeamForm from "../../components/teams/TeamForm";
import "./Teams.css";

function Teams() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadTeams();
    }, [searchQuery]);

    const loadTeams = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchQuery) {
                params.search = searchQuery;
            }
            const response = await getTeams(params);
            setTeams(response.data.data.content || []);
        } catch (error) {
            console.error("Error fetching teams:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeam = async (teamData) => {
        try {
            await createTeam(teamData);
            alert("Team created successfully");
            setShowModal(false);
            loadTeams();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Unable to create team.");
        }
    };

    const handleUpdateTeam = async (teamData) => {
        try {
            await updateTeam(editingTeam.id, teamData);
            alert("Team updated successfully");
            setEditingTeam(null);
            loadTeams();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Unable to update team.");
        }
    };

    const handleDeleteTeam = async (id) => {
        if (!window.confirm("Are you sure you want to delete this team?")) return;
        try {
            await deleteTeam(id);
            alert("Team deleted successfully");
            loadTeams();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Unable to delete team.");
        }
    };

    return (
        <MainLayout>
            <div className="teams-container">
                <div className="teams-header">
                    <h1>Team Management</h1>
                    <button
                        className="add-btn"
                        onClick={() => {
                            setEditingTeam(null);
                            setShowModal(true);
                        }}
                    >
                        + Add Team
                    </button>
                </div>

                <input
                    className="search-box"
                    type="text"
                    placeholder="Search teams by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {loading ? (
                    <p>Loading teams...</p>
                ) : (
                    <table className="teams-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Leader Email</th>
                                <th>Members Count</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams.length > 0 ? (
                                teams.map(team => (
                                    <tr key={team.id}>
                                        <td style={{ fontWeight: "600" }}>{team.name}</td>
                                        <td>{team.description}</td>
                                        <td>{team.teamLeaderEmail || "-"}</td>
                                        <td>{team.memberIds ? team.memberIds.length : 0}</td>
                                        <td>
                                            <span className={`status-badge ${team.status.toLowerCase()}`}>
                                                {team.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="edit-btn"
                                                onClick={() => setEditingTeam(team)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteTeam(team.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center" }}>
                                        No Teams Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <Modal
                    title="Create Team"
                    onClose={() => setShowModal(false)}
                >
                    <TeamForm onSubmit={handleCreateTeam} />
                </Modal>
            )}

            {editingTeam && (
                <Modal
                    title="Edit Team"
                    onClose={() => setEditingTeam(null)}
                >
                    <TeamForm
                        initialData={editingTeam}
                        onSubmit={handleUpdateTeam}
                    />
                </Modal>
            )}
        </MainLayout>
    );
}

export default Teams;