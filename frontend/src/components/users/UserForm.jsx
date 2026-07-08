import { useState } from "react";

function UserForm({ onSubmit }) {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "DEVELOPER",
        status: "ACTIVE"
    });

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit(formData);

    };

    return (

        <form onSubmit={handleSubmit}>

            <input
                name="firstName"
                placeholder="First Name"
                onChange={handleChange}
            />

            <br/><br/>

            <input
                name="lastName"
                placeholder="Last Name"
                onChange={handleChange}
            />

            <br/><br/>

            <input
                name="email"
                placeholder="Email"
                onChange={handleChange}
            />

            <br/><br/>

            <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
            />

            <br/><br/>

            <select
                name="role"
                onChange={handleChange}
            >

                <option>ADMIN</option>

                <option>PROJECT_MANAGER</option>

                <option>DEVELOPER</option>

                <option>TESTER</option>

                <option>DEVOPS_ENGINEER</option>

            </select>

            <br/><br/>

            <select
                name="status"
                onChange={handleChange}
            >

                <option>ACTIVE</option>

                <option>INACTIVE</option>

            </select>

            <br/><br/>

            <button type="submit">

                Save User

            </button>

        </form>

    );

}

export default UserForm;