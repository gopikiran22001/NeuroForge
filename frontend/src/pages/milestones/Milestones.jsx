import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getMilestones, createMilestone, updateMilestone, deleteMilestone } from "../../services/milestoneService";
import Modal from "../../components/common/Modal";
import MilestoneForm from "../../components/milestones/MilestoneForm";
import "./Milestones.css";

function Milestones() {
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadMilestones();
    }, [searchQuery]);

    const loadMilestones = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchQuery) {
                params.search = searchQuery;
            }
            const response = await getMilestones(params);
            setMilestones(response.data.data.content || []);
        } catch (error) {
            console.error("Error fetching milestones:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMilestone = async (milestoneData) => {
        try {
            await createMilestone(milestoneData);
            alert("Milestone created successfully");
            setShowModal(false);
            loadMilestones();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Unable to create milestone.");
        }
    };

    const handleUpdateMilestone = async (milestoneData) => {
        try {
            await updateMilestone(editingMilestone.id, milestoneData);
            alert("Milestone updated successfully");
            setEditingMilestone(null);
            loadMilestones();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Unable to update milestone.");
        }
    };

    const handleDeleteMilestone = async (id) => {
        if (!window.confirm("Are you sure you want to delete this milestone?")) return;
        try {
            await deleteMilestone(id);
            alert("Milestone deleted successfully");
            loadMilestones();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Unable to delete milestone.");
        }
    };

    return (
        <MainLayout>
            <div className="milestones-container">
                <div className="milestones-header">
                    <h1>Milestone Management</h1>
                    <button
                        className="add-btn"
                        onClick={() => {
                            setEditingMilestone(null);
                            setShowModal(true);
                        }}
                    >
                        + Add Milestone
                    </button>
                </div>

                <input
                    className="search-box"
                    type="text"
                    placeholder="Search milestones by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {loading ? (
                    <p>Loading milestones...</p>
                ) : (
                    <table className="milestones-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Project Code</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {milestones.length > 0 ? (
                                milestones.map(milestone => (
                                    <tr key={milestone.id}>
                                        <td style={{ fontWeight: "600" }}>{milestone.name}</td>
                                        <td>{milestone.description || "-"}</td>
                                        <td>{milestone.projectCode || "-"}</td>
                                        <td>{milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : "-"}</td>
                                        <td>
                                            <span className={`status-badge ${milestone.status.toLowerCase()}`}>
                                                {milestone.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="edit-btn"
                                                onClick={() => setEditingMilestone(milestone)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteMilestone(milestone.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center" }}>
                                        No Milestones Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <Modal
                    title="Create Milestone"
                    onClose={() => setShowModal(false)}
                >
                    <MilestoneForm onSubmit={handleCreateMilestone} />
                </Modal>
            )}

            {editingMilestone && (
                <Modal
                    title="Edit Milestone"
                    onClose={() => setEditingMilestone(null)}
                >
                    <MilestoneForm
                        initialData={editingMilestone}
                        onSubmit={handleUpdateMilestone}
                    />
                </Modal>
            )}
        </MainLayout>
    );
}

export default Milestones;