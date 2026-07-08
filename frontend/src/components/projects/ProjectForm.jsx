import { useState, useEffect } from "react";
import { getUsers } from "../../services/userService";
import { getTeams } from "../../services/teamService";

function ProjectForm({ onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
        startDate: "",
        endDate: "",
        projectManagerId: "",
        teamIds: [],
        status: "PLANNING"
    });

    const [managers, setManagers] = useState([]);
    const [teamsList, setTeamsList] = useState([]);
    const [loadingResources, setLoadingResources] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const usersResponse = await getUsers();
                const teamsResponse = await getTeams();
                
                const allUsers = usersResponse.data.data.content || [];
                const pms = allUsers.filter(u => u.role === "PROJECT_MANAGER" || u.role === "ADMIN");
                setManagers(pms.length > 0 ? pms : allUsers);

                setTeamsList(teamsResponse.data.data.content || []);

                if (initialData) {
                    setFormData({
                        name: initialData.name || "",
                        code: initialData.code || "",
                        description: initialData.description || "",
                        startDate: initialData.startDate ? initialData.startDate.substring(0, 10) : "",
                        endDate: initialData.endDate ? initialData.endDate.substring(0, 10) : "",
                        projectManagerId: initialData.projectManagerId || "",
                        teamIds: initialData.teamIds || [],
                        status: initialData.status || "PLANNING"
                    });
                } else {
                    const defaultPm = pms.length > 0 ? pms[0].id : (allUsers.length > 0 ? allUsers[0].id : "");
                    setFormData(prev => ({
                        ...prev,
                        projectManagerId: defaultPm
                    }));
                }
            } catch (error) {
                console.error("Error loading form dependencies:", error);
            } finally {
                setLoadingResources(false);
            }
        };

        fetchResources();
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleTeamChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({
            ...formData,
            teamIds: selectedOptions
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
        <form onSubmit={handleSubmit} className="project-form">
            <div className="form-group" style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Project Name</label>
                <input
                    name="name"
                    value={formData.name}
                    placeholder="Project Name"
                    onChange={handleChange}
                    required
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Project Code</label>
                <input
                    name="code"
                    value={formData.code}
                    placeholder="e.g. NF-2026"
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
                    placeholder="Project Description"
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
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Project Manager</label>
                <select
                    name="projectManagerId"
                    value={formData.projectManagerId}
                    onChange={handleChange}
                    required
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                >
                    <option value="">Select Project Manager</option>
                    {managers.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Assigned Teams (Hold Ctrl / Cmd to multi-select)</label>
                <select
                    multiple
                    name="teamIds"
                    value={formData.teamIds}
                    onChange={handleTeamChange}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", height: "100px" }}
                >
                    {teamsList.map(team => (
                        <option key={team.id} value={team.id}>
                            {team.name}
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
                    <option>PLANNING</option>
                    <option>ACTIVE</option>
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
                {initialData ? "Update Project" : "Create Project"}
            </button>
        </form>
    );
}

export default ProjectForm;
