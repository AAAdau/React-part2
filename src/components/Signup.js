import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "../api";  // Import the signUpUser function
import './Signup.css';

export default function SignUp() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        termsAccepted: false
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.termsAccepted) {
            alert("You must accept the terms and conditions.");
            return;
        }

        try {
            const newUser = await signUpUser(formData.name, formData.email, formData.password);
            console.log('User signed up:', newUser);
            alert("You have successfully signed up!");
            navigate("/login"); // Redirect to login page after successful signup
        } catch (error) {
            alert("Sign-up failed. Please try again.");
        }
    };

    const handleNavigateToLogin = () => {
        navigate("/login");
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="form-group">
                        <input
                            placeholder="Username"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            placeholder="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            placeholder="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                name="termsAccepted"
                                checked={formData.termsAccepted}
                                onChange={handleChange}
                                required
                            />
                            I agree with the Terms & Conditions
                        </label>
                    </div>
                    <button type="submit" className="signup-button">Sign Up</button>
                </form>
                <div className="login-link">
                    <span onClick={handleNavigateToLogin} className="login-link-text">Already have an account? Sign In</span>
                </div>
            </div>
        </div>
    );
}
