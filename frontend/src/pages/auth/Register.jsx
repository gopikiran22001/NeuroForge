import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import "./Register.css";

function Register() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "DEVELOPER"
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await register(formData);
            setUser(response.data.data.user);
            alert("Registration Successful");
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert("Unable to connect to server.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card register-card">
                <div className="login-brand">
                    <div className="brand-logo">N</div>
                    <h1>NeuroForge</h1>
                </div>

                <p className="login-subtitle">Create your Nexus account</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div style={{ display: "flex", gap: "12px" }}>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Jane"
                                required
                            />
                        </div>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Doe"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="jane.doe@example.com"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Choose password (min 6 chars)"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Select Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            style={{
                                background: "rgba(15, 23, 42, 0.6)",
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                borderRadius: "10px",
                                padding: "12px 16px",
                                color: "#ffffff",
                                fontSize: "0.95rem",
                                outline: "none",
                                cursor: "pointer"
                            }}
                        >
                            <option value="DEVELOPER">Developer</option>
                            <option value="PROJECT_MANAGER">Project Manager</option>
                            <option value="ADMIN">Admin</option>
                            <option value="TESTER">Tester</option>
                            <option value="DEVOPS_ENGINEER">DevOps Engineer</option>
                        </select>
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                <div className="auth-links">
                    <p>Already have an account? <Link to="/" className="auth-link">Sign in instead</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Register;