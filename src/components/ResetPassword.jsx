import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CSS/resetpassword.css';

const ResetPassword = () => {
    const { token } = useParams();  // ✅ Get token from URL
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            // const res = await axios.post('http://localhost:5500/password_reset/reset-password', {
            const res = await axios.post("https://mern-backend-acet.onrender.com/password_reset/reset-password", {
                token,
                password: newPassword,
            });

            setMessage(res.data.message);
            setTimeout(() => navigate('/login'), 3000);  // Redirect to login after success
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
        }
    };

    return (
        <div className="reset-password-container">

            <div className="card">
                <form onSubmit={handleResetPassword}>
                    <h3 className="text-black text-center mb-3">Reset Your Password</h3>

                    {error && <p className="text-danger text-center">{error}</p>}
                    {message && <p className="text-success text-center">{message}</p>}
                    <div className="mb-3">
                        <label htmlFor="newPassword" className="text-black">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            className="form-control"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="Enter new password"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="text-black">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm new password"
                        />
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <button type="submit" className="btn btn-warning">Reset Password</button>
                    </div>

                </form>
            </div>

        </div>
    );
};

export default ResetPassword;
