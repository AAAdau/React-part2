import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css'; // Optional: Add your own styles for the Login component

export default function Login() {
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

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login Data:', credentials); // For now, log the data
        // Here you can add your API call to log in the user
    };

    // Handle Google login
    const handleGoogleLogin = () => {
        window.open('https://accounts.google.com/signin', '_blank');
    };

    // Handle Facebook login
    const handleFacebookLogin = () => {
        window.open('https://www.facebook.com/login', '_blank');
    };
    const handleNavigateToSignup = () => {
        navigate("/sign-up"); // Adjust the route as needed
    };
    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Sign In</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <input
                            placeholder="username"
                            type="email"
                            id="email"
                            name="email"
                            value={credentials.email}
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
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Sign In</button>
                </form>
                <div className="divider">
                    <hr />
                    <span>or</span>
                    <hr />
                </div>
                <button className="google-button" onClick={handleGoogleLogin}>
                    <img src="https://www.svgrepo.com/show/446762/google-alt.svg" width="23px" />
                    Continue with Google
                </button>
                <button className="facebook-button" onClick={handleFacebookLogin}>
                    <img src="https://www.svgrepo.com/show/503338/facebook.svg" width="23px" />
                    Continue with Facebook
                </button>
                <div className="signup-link">
                    <span onClick={handleNavigateToSignup} className="signup-link-text"> Don't have an account? Sign up</span>
                </div>
            </div>
        </div>
    );
}
