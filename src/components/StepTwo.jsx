import React, { useState } from "react";

const StepTwo = ({ formData, handleChange, nextStep, prevStep }) => {
    const [base64, setBase64] = useState("");
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let newErrors = {};

        if (!formData.username || formData.username.trim().length < 6) {
            newErrors.username = !formData.username ? "Username required" : "Username must be at least 6 characters long";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // ✅ Return true if no errors
    };

    // const [msg, setMsg] = useState("");
    const handleNext = () => {
        if (validateForm()) {
            // Save data to localStorage before moving to the next step
            localStorage.setItem("stepOneData", JSON.stringify(formData));
            nextStep();
        }
    };

    // Convert image to Base64
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const base64String = reader.result;
                setBase64(base64String);
                handleChange({ target: { name: "image", value: base64String } });  //✅ Save Base64 image in formData


            };
        }
    };

    return (
        <div className="step-container">
            <div className="step-card">
                <h3 className="text-center text-light">Choose a Username</h3>

                {/* Username Input */}
                <div className="mb-3">
                    <label className="form-label text-light">Username</label>
                    <input
                        type="text"
                        name="username"
                        className="form-control"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="Enter a unique username"
                    />
                    {errors.username && <p className="text-danger">{errors.username}</p>}
                </div>

                {/* Image Upload & Base64 Conversion */}
                <div className="mb-3">
                    <label className="form-label text-light">Upload Profile Picture</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="form-control" />
                    {base64 && (
                        <div className="mt-3">
                            <img src={base64} alt="Converted" className="mt-2" style={{ width: "200px" }} />
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="button-group">
                    <button className="btn btn-secondary me-2" style={{ padding: "7px 10px" }} onClick={prevStep}>Back</button>
                    <button className="btn btn-primary" style={{ padding: "7px 10px" }} onClick={handleNext}>Next</button>
                </div>
            </div>
        </div>
    );
};
export default StepTwo;
