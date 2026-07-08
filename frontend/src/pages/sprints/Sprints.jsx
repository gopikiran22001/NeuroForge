import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getSprints, createSprint, updateSprint, deleteSprint } from "../../services/sprintService";
import Modal from "../../components/common/Modal";
import SprintForm from "../../components/sprints/SprintForm";
import "./Sprints.css";

function Sprints() {
    const [sprints, setSprints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSprint, setEditingSprint] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadSprints();
    }, [searchQuery]);

    const loadSprints = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchQuery) {
                params.search = searchQuery;
            }
            const response = await getSprints(params);
            setSprints(response.data.data.content || []);
        } catch (error) {
            console.error("Error fetching sprints:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSprint = async (sprintData) => {
        try {
            await createSprint(sprintData);
            alert("Sprint created successfully");
            setShowModal(false);
            loadSprints();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Unable to create sprint.");
        }
    };

    const handleUpdateSprint = async (sprintData) => {
        try {
            await updateSprint(editingSprint.id, sprintData);
            alert("Sprint updated successfully");
            setEditingSprint(null);
            loadSprints();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Unable to update sprint.");
        }
    };

    const handleDeleteSprint = async (id) => {
        if (!window.confirm("Are you sure you want to delete this sprint?")) return;
        try {
            await deleteSprint(id);
            alert("Sprint deleted successfully");
            loadSprints();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Unable to delete sprint.");
        }
    };

    return (
        <MainLayout>
            <div className="sprints-container">
                <div className="sprints-header">
                    <h1>Sprint Management</h1>
                    <button
                        className="add-btn"
                        onClick={() => {
                            setEditingSprint(null);
                            setShowModal(true);
                        }}
                    >
                        + Add Sprint
                    </button>
                </div>

                <input
                    className="search-box"
                    type="text"
                    placeholder="Search sprints by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {loading ? (
                    <p>Loading sprints...</p>
                ) : (
                    <table className="sprints-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Goal</th>
                                <th>Project Code</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sprints.length > 0 ? (
                                sprints.map(sprint => (
                                    <tr key={sprint.id}>
                                        <td style={{ fontWeight: "600" }}>{sprint.name}</td>
                                        <td>{sprint.goal || "-"}</td>
                                        <td>{sprint.projectCode || "-"}</td>
                                        <td>{sprint.startDate ? new Date(sprint.startDate).toLocaleDateString() : "-"}</td>
                                        <td>{sprint.endDate ? new Date(sprint.endDate).toLocaleDateString() : "-"}</td>
                                        <td>
                                            <span className={`status-badge ${sprint.status.toLowerCase()}`}>
                                                {sprint.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="edit-btn"
                                                onClick={() => setEditingSprint(sprint)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteSprint(sprint.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center" }}>
                                        No Sprints Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <Modal
                    title="Create Sprint"
                    onClose={() => setShowModal(false)}
                >
                    <SprintForm onSubmit={handleCreateSprint} />
                </Modal>
            )}

            {editingSprint && (
                <Modal
                    title="Edit Sprint"
                    onClose={() => setEditingSprint(null)}
                >
                    <SprintForm
                        initialData={editingSprint}
                        onSubmit={handleUpdateSprint}
                    />
                </Modal>
            )}
        </MainLayout>
    );
}

export default Sprints;