import { useState, useEffect } from "react";
import { getUsers } from "../../services/userService";

function TeamForm({ onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        teamLeaderId: "",
        memberIds: [],
        status: "ACTIVE"
    });

    const [usersList, setUsersList] = useState([]);
    const [loadingResources, setLoadingResources] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers();
                const allUsers = response.data.data.content || [];
                setUsersList(allUsers);

                if (initialData) {
                    setFormData({
                        name: initialData.name || "",
                        description: initialData.description || "",
                        teamLeaderId: initialData.teamLeaderId || "",
                        memberIds: initialData.memberIds || [],
                        status: initialData.status || "ACTIVE"
                    });
                } else if (allUsers.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        teamLeaderId: allUsers[0].id
                    }));
                }
            } catch (error) {
                console.error("Error loading team dependencies:", error);
            } finally {
                setLoadingResources(false);
            }
        };

        fetchUsers();
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleMemberChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({
            ...formData,
            memberIds: selectedOptions
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (loadingResources) {
        return <p>Loading options...</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="team-form">
            <div className="form-group" style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Team Name</label>
                <input
                    name="name"
                    value={formData.name}
                    placeholder="Team Name"
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
                    placeholder="Team Description"
                    onChange={handleChange}
                    required
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", height: "80px" }}
                />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Team Leader</label>
                <select
                    name="teamLeaderId"
                    value={formData.teamLeaderId}
                    onChange={handleChange}
                    required
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                >
                    <option value="">Select Team Leader</option>
                    {usersList.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName} ({user.role})
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Members (Hold Ctrl / Cmd to multi-select)</label>
                <select
                    multiple
                    name="memberIds"
                    value={formData.memberIds}
                    onChange={handleMemberChange}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", height: "120px" }}
                >
                    {usersList.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName}
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
                    <option>ACTIVE</option>
                    <option>INACTIVE</option>
                    <option>DELETED</option>
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
                {initialData ? "Update Team" : "Create Team"}
            </button>
        </form>
    );
}

export default TeamForm;
