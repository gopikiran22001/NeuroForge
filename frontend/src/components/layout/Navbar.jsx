import { useAuth } from "../../context/AuthContext";
import { logout } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
            navigate("/");
        } catch (error) {
            console.error("Error logging out:", error);
            setUser(null);
            navigate("/");
        }
    };

    return (
        <div
            style={{
                height: "70px",
                background: "rgba(15, 23, 42, 0.45)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px"
            }}
        >
            <h3 style={{ margin: 0, color: "#ffffff", fontSize: "1.2rem", fontWeight: "700" }}>
                NeuroForge Nexus
            </h3>
            
            {user && (
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: "600", fontSize: "0.95rem", color: "#f8fafc" }}>
                            {user.firstName} {user.lastName}
                        </div>
                        <span style={{
                            fontSize: "0.7rem",
                            fontWeight: "700",
                            background: "rgba(99, 102, 241, 0.15)",
                            color: "#a5b4fc",
                            border: "1px solid rgba(99, 102, 241, 0.3)",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            textTransform: "uppercase",
                            display: "inline-block",
                            marginTop: "2px"
                        }}>
                            {user.role.replace("_", " ")}
                        </span>
                    </div>

                    <button
                        onClick={handleLogout}
                        style={{
                            background: "#dc2626",
                            color: "#ffffff",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            fontWeight: "600",
                            fontSize: "0.9rem",
                            cursor: "pointer",
                            transition: "background 0.15s ease"
                        }}
                        onMouseEnter={(e) => e.target.style.background = "#b91c1c"}
                        onMouseLeave={(e) => e.target.style.background = "#dc2626"}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export default Navbar;