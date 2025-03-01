import React, { useState, useEffect } from "react";
import home_logo from '../../src/homepage.png';
const StepOne = ({ formData, handleChange, nextStep }) => {
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Retrieve saved data from localStorage on component mount
        const savedData = localStorage.getItem("stepOneData");
        if (savedData) {
            handleChange({ target: { name: "email", value: JSON.parse(savedData).email } });
            handleChange({ target: { name: "firstname", value: JSON.parse(savedData).firstname } });
            handleChange({ target: { name: "lastname", value: JSON.parse(savedData).lastname } });
            handleChange({ target: { name: "password", value: JSON.parse(savedData).password } });
        }
    }, []);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Valid email is required";
        }
        if (!formData.firstname.trim()) {
            newErrors.firstname = "First name is required";
        }
        if (!formData.lastname.trim()) {
            newErrors.lastname = "Last name is required";
        }
        if (!formData.password || formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    // const [msg, setMsg] = useState("");
    const handleNext = () => {
        if (validateForm()) {
            // Save data to localStorage before moving to the next step
            localStorage.setItem("stepOneData", JSON.stringify(formData));
            nextStep();
        }
    };

    return (
        <div className="step-container">
            <div className="step-card">
                <h3 className="text-center text-light mb-4">Basic Information</h3>

                {/* Email Input */}
                <div className="mb-3">
                    <label className="form-label text-light" style={{ fontSize: "3vh" }}>Email</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-danger">{errors.email}</p>}
                </div>

                {/* First Name */}
                <div className="mb-3">
                    <label className="form-label text-light" style={{ fontSize: "3vh" }}>First Name</label>
                    <input
                        type="text"
                        name="firstname"
                        className="form-control"
                        value={formData.firstname}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                    />
                    {errors.firstname && <p className="text-danger">{errors.firstname}</p>}
                </div>

                {/* Last Name */}
                <div className="mb-3">
                    <label className="form-label text-light" style={{ fontSize: "3vh" }}>Last Name</label>
                    <input
                        type="text"
                        name="lastname"
                        className="form-control"
                        value={formData.lastname}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                    />
                    {errors.lastname && <p className="text-danger">{errors.lastname}</p>}
                </div>

                {/* Password */}
                <div className="mb-3">
                    <label className="form-label text-light" style={{ fontSize: "3vh" }}>Password</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                    />
                    {errors.password && <p className="text-danger">{errors.password}</p>}
                </div>

                {/* Next Button */}
                <div className="d-flex align-items-center justify-content-center flex-column">
                    {/* <p>{msg}</p> */}
                    <button className="btn btn-primary mt-1" style={{ padding: "7px 10px" }} onClick={handleNext}>
                        Next
                    </button>
                </div>
                <div className="mt-3 d-flex flex-row justify-content-between">
                    <a href="/" className="text-info d-flex flex-row align-items-center" style={{ textDecoration: "none" }}>
                    <img src={home_logo} alt="Home" style={{ width: "30px", height: "30px" }} />
                    </a>
                    <a href="/Login" className="text-blue d-flex flex-row align-items-center" style={{ textDecoration: "none" }}>
                        <span className="ms-2" style={{ fontSize: "1rem" }}>Already have an account?</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default StepOne;
