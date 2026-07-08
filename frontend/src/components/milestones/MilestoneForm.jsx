import { useState, useEffect } from "react";
import { getProjects } from "../../services/projectService";

function MilestoneForm({ onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        dueDate: "",
        projectId: "",
        status: "PLANNED"
    });

    const [projectsList, setProjectsList] = useState([]);
    const [loadingResources, setLoadingResources] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await getProjects();
                const allProjects = response.data.data.content || [];
                setProjectsList(allProjects);

                if (initialData) {
                    setFormData({
                        name: initialData.name || "",
                        description: initialData.description || "",
                        dueDate: initialData.dueDate ? initialData.dueDate.substring(0, 10) : "",
                        projectId: initialData.projectId || "",
                        status: initialData.status || "PLANNED"
                    });
                } else if (allProjects.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        projectId: allProjects[0].id
                    }));
                }
            } catch (error) {
                console.error("Error loading milestone dependencies:", error);
            } finally {
                setLoadingResources(false);
            }
        };

        fetchProjects();
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedData = {
            ...formData,
            dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
        };
        onSubmit(formattedData);
    };

    if (loadingResources) {
        return <p>Loading options...</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="milestone-form">
            <div className="form-group" style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Milestone Name</label>
                <input
                    name="name"
                    value={formData.name}
                    placeholder="Milestone Name"
                    onChange={handleChange}
                    required
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    placeholder="Milestone Description"
                    onChange={handleChange}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", height: "80px" }}
                />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Due Date</label>
                <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Parent Project</label>
                <select
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleChange}
                    required
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                >
                    <option value="">Select Project</option>
                    {projectsList.map(project => (
                        <option key={project.id} value={project.id}>
                            {project.name} ({project.code})
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group" style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Status</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                >
                    <option>PLANNED</option>
                    <option>IN_PROGRESS</option>
                    <option>ON_HOLD</option>
                    <option>COMPLETED</option>
                    <option>CANCELLED</option>
                </select>
            </div>

            <button type="submit" style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                width: "100%"
            }}>
                {initialData ? "Update Milestone" : "Create Milestone"}
            </button>
        </form>
    );
}

export default MilestoneForm;
