import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";  // Import the loginUser function
import './Login.css';

export default function Login({ setUser }) {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const users = await loginUser(credentials.email, credentials.password);
            if (users.length > 0) {
                console.log('Login successful:', users[0]);
                setUser(users[0]);  // Update user state after login
                navigate("/"); // Redirect to home page
            } else {
                alert("Invalid email or password.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred during login. Please try again.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Sign In</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <input
                            placeholder="Email"
                            type="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            placeholder="Password"
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Sign In</button>
                </form>
            </div>
        </div>
    );
}
