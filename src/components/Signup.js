import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser, checkEmailExists } from "../api"; // 引入 API 方法

import "./Signup.css";

export default function SignUp() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        termsAccepted: false // New state for the checkbox
    });
    const [isSubmitting, setIsSubmitting] = useState(false); // 防止多次提交

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

        if (isSubmitting) return; // 防止多次提交
        setIsSubmitting(true);

        try {
            // 检查 email 是否已经存在
            const emailExists = await checkEmailExists(formData.email);
            if (emailExists) {
                alert("This email is already registered.");
                setIsSubmitting(false);
                return;
            }

            // 注册用户
            const user = await signUpUser(formData.name, formData.email, formData.password);
            if (user) {
                alert("Sign up successful! ");
                navigate("/login");
            }
        } catch (error) {
            console.error("Error during sign-up:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
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
                            placeholder="username"
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            placeholder="email"
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            placeholder="password"
                            type="password"
                            id="password"
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
                    <button type="submit" className="signup-button" disabled={isSubmitting}>
                        {isSubmitting ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>
                <div className="login-link">
                    <span onClick={handleNavigateToLogin} className="login-link-text">
                        Already have an account? Sign In
                    </span>
                </div>
            </div>
        </div>
    );
}
