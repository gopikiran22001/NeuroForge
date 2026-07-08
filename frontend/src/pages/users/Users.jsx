import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getUsers, createUser } from "../../services/userService";
import Modal from "../../components/common/Modal";
import UserForm from "../../components/users/UserForm";
import "./Users.css";

function Users() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {

        try {

            const response = await getUsers();

            console.log("Users Response:", response.data);

            setUsers(response.data.data.content || []);

        } catch (error) {

            console.error("Error fetching users:", error);

        } finally {

            setLoading(false);

        }

    };

    const handleCreateUser = async (userData) => {

        try {

            await createUser(userData);

            alert("User created successfully");

            setShowModal(false);

            loadUsers();

        } catch (error) {

            console.error(error);

            if (error.response) {

                alert(error.response.data.message);

            } else {

                alert("Unable to create user.");

            }

        }

    };

    return (

        <MainLayout>

            <div className="users-container">

                <div className="users-header">

                    <h1>User Management</h1>

                    <button
                        className="add-btn"
                        onClick={() => setShowModal(true)}
                    >
                        + Add User
                    </button>

                </div>

                <input
                    className="search-box"
                    type="text"
                    placeholder="Search users..."
                />

                {loading ? (

                    <p>Loading users...</p>

                ) : (

                    <table className="users-table">

                        <thead>

                        <tr>

                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>

                        </tr>

                        </thead>

                        <tbody>

                        {users.length > 0 ? (

                            users.map(user => (

                                <tr key={user.id}>

                                    <td>
                                        {user.firstName} {user.lastName}
                                    </td>

                                    <td>{user.email}</td>

                                    <td>{user.role}</td>

                                    <td>
                                        <span className={`status-badge ${user.status.toLowerCase()}`}>
                                            {user.status}
                                        </span>
                                    </td>

                                    <td>

                                        <button className="edit-btn">
                                            Edit
                                        </button>

                                        <button className="delete-btn">
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="5"
                                    style={{ textAlign: "center" }}
                                >
                                    No Users Found
                                </td>

                            </tr>

                        )}

                        </tbody>

                    </table>

                )}

            </div>

            {showModal && (

                <Modal
                    title="Create User"
                    onClose={() => setShowModal(false)}
                >

                    <UserForm
                        onSubmit={handleCreateUser}
                    />

                </Modal>

            )}

        </MainLayout>

    );
}

export default Users;