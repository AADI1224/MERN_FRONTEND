import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/forgotpassword.css"; // Import the external CSS file

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            // const res = await axios.post("http://localhost:5500/password_reset/send-reset-link", { email });
            const res = await axios.post("https://mern-backend-acet.onrender.com/password_reset/send-reset-link", { email });
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
        }
    };

    return (
        <div className="forgot-password-container">
            <form onSubmit={handleForgotPassword} className="forgot-password-form">
                <h3>Reset Password</h3>

                {error && <p className="message error">{error}</p>}
                {message && <p className="message success">{message}</p>}

                <input
                    type="email"
                    id="email"
                    className="form-control mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                />

                <div className="btn-group align-items-center justify-content-center">
                    <button type="submit" className="button me-2">Send Reset Link</button>
                    <button type="button" className="back-button" onClick={() => navigate("/login")}>
                        Back to Login
                    </button>
                </div>

            </form>
        </div>
    );
};

export default ForgotPassword;
