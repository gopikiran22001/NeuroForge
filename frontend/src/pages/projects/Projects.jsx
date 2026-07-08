import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getProjects, createProject, updateProject, deleteProject } from "../../services/projectService";
import Modal from "../../components/common/Modal";
import ProjectForm from "../../components/projects/ProjectForm";
import "./Projects.css";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadProjects();
    }, [searchQuery]);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchQuery) {
                params.search = searchQuery;
            }
            const response = await getProjects(params);
            setProjects(response.data.data.content || []);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (projectData) => {
        try {
            await createProject(projectData);
            alert("Project created successfully");
            setShowModal(false);
            loadProjects();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Unable to create project.");
        }
    };

    const handleUpdateProject = async (projectData) => {
        try {
            await updateProject(editingProject.id, projectData);
            alert("Project updated successfully");
            setEditingProject(null);
            loadProjects();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Unable to update project.");
        }
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            await deleteProject(id);
            alert("Project deleted successfully");
            loadProjects();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Unable to delete project.");
        }
    };

    return (
        <MainLayout>
            <div className="projects-container">
                <div className="projects-header">
                    <h1>Project Management</h1>
                    <button
                        className="add-btn"
                        onClick={() => {
                            setEditingProject(null);
                            setShowModal(true);
                        }}
                    >
                        + Add Project
                    </button>
                </div>

                <input
                    className="search-box"
                    type="text"
                    placeholder="Search projects by name or code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {loading ? (
                    <p>Loading projects...</p>
                ) : (
                    <table className="projects-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length > 0 ? (
                                projects.map(project => (
                                    <tr key={project.id}>
                                        <td style={{ fontWeight: "600" }}>{project.code}</td>
                                        <td>{project.name}</td>
                                        <td>{project.description || "-"}</td>
                                        <td>{project.startDate ? new Date(project.startDate).toLocaleDateString() : "-"}</td>
                                        <td>{project.endDate ? new Date(project.endDate).toLocaleDateString() : "-"}</td>
                                        <td>
                                            <span className={`status-badge ${project.status.toLowerCase()}`}>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="edit-btn"
                                                onClick={() => setEditingProject(project)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteProject(project.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center" }}>
                                        No Projects Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <Modal
                    title="Create Project"
                    onClose={() => setShowModal(false)}
                >
                    <ProjectForm onSubmit={handleCreateProject} />
                </Modal>
            )}

            {editingProject && (
                <Modal
                    title="Edit Project"
                    onClose={() => setEditingProject(null)}
                >
                    <ProjectForm
                        initialData={editingProject}
                        onSubmit={handleUpdateProject}
                    />
                </Modal>
            )}
        </MainLayout>
    );
}

export default Projects;