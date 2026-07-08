import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {

    const { user } = useAuth();

    return (
        <MainLayout>

            <h1>Dashboard</h1>

            {user ? (
                <>
                    <h2>Welcome {user.firstName}</h2>
                    <p>Role: {user.role}</p>
                    <p>Email: {user.email}</p>
                </>
            ) : (
                <p>No user information available.</p>
            )}

        </MainLayout>
    );
}

export default Dashboard;