import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

function MainLayout({ children }) {
    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            <Sidebar />

            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Navbar />

                <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default MainLayout;