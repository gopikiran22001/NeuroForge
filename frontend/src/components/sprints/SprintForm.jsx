import { useState, useEffect } from "react";
import { getProjects } from "../../services/projectService";

function SprintForm({ onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        name: "",
        goal: "",
        startDate: "",
        endDate: "",
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
                        goal: initialData.goal || "",
                        startDate: initialData.startDate ? initialData.startDate.substring(0, 10) : "",
                        endDate: initialData.endDate ? initialData.endDate.substring(0, 10) : "",
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
                console.error("Error loading sprint dependencies:", error);
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
            startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
            endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null
        };
        onSubmit(formattedData);
    };

    if (loadingResources) {
        return <p>Loading options...</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="sprint-form">
            <div className="form-group" style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Sprint Name</label>
                <input
                    name="name"
                    value={formData.name}
                    placeholder="Sprint Name"
                    onChange={handleChange}
                    required
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Goal</label>
                <textarea
                    name="goal"
                    value={formData.goal}
                    placeholder="Sprint Goal"
                    onChange={handleChange}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", height: "80px" }}
                />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Start Date</label>
                <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>End Date</label>
                <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
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
                    <option>ACTIVE</option>
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
                {initialData ? "Update Sprint" : "Create Sprint"}
            </button>
        </form>
    );
}

export default SprintForm;
