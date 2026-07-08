import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
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
            const response = await login(formData);
            setUser(response.data.data.user);
            alert("Login Successful");
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
            <div className="login-card">
                <div className="login-brand">
                    <div className="brand-logo">N</div>
                    <h1>NeuroForge</h1>
                </div>

                <p className="login-subtitle">Nexus Portal Access</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
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
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "Verifying..." : "Sign In"}
                    </button>
                </form>

                <div className="auth-links">
                    <p>Don't have an account? <Link to="/register" className="auth-link">Register here</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;