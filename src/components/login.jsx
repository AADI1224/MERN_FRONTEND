import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../CSS/login.css';
import logo from '../../src/logo-transparent-png.png';
import home_logo from '../../src/homepage.png';

const Login = () => {
    const [Identifier, setIdentifier] = useState('');
    const [Password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false); // State to manage Forgot Password link
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setShowForgotPassword(false); // Reset on each attempt

        try {
            const response = await axios.post(
                'http://localhost:5500/users/login',
                // "https://mern-backend-acet.onrender.com/users/login",
                { Identifier, Password },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data.token) {
                localStorage.setItem('auth_token', response.data.token);
                localStorage.setItem('firstname', response.data.Firstname);
                localStorage.setItem('image', response.data.Image);
                alert('Login successful!');
                navigate('/dashboard');
            } else {
                setError('Login failed! No token received.');
            }
        } catch (err) {
            console.error('Error during login:', err);
            setError(err.response?.data?.message || 'Invalid email or password!');

            // Show the "Forgot Password?" link only for wrong password error
            if (err.response?.data?.message?.toLowerCase().includes('password')) {
                setShowForgotPassword(true);
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="d-flex align-items-center justify-content-center mb-4 w-100">
                    <img src={logo} alt="logo" style={{ height: "36vh", width: "32vh" }} />
                </div>

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="Identifier" className="text-light mb-2">Email or Username</label>
                        <input
                            type="text"
                            id="Identifier"
                            className="form-control"
                            value={Identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                            placeholder="Enter your email or username"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="Password" className="text-light mb-2">Password</label>
                        <input
                            type="password"
                            id="Password"
                            className="form-control"
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="text-center mt-3">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>

                    <div className="text-center mt-3">
                        <span className="text-light">Don't have an account? </span>
                        <a href="/signup" className="text-warning">Sign Up</a>
                    </div>

                    <div className="mt-3">
                        <a href="/" className="text-warning d-flex flex-row align-items-center" style={{textDecoration:"none"}}>
                            <img src={home_logo} alt="Home" style={{ width: "30px", height: "30px" }} />
                            <span className="ms-2" style={{fontSize:"1rem"}}>home</span>
                        </a>
                    </div>

                    {/* Conditionally render "Forgot Password?" link if the password is wrong */}
                    {showForgotPassword && (
                        <div className="text-center mt-2">
                            <Link to="/forgot-password" className="text">
                                Forgot Password?
                            </Link>
                        </div>
                    )}

                </form>
            </div>
        </div>
    );
};

export default Login;
