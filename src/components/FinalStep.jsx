import React from "react";

const FinalStep = ({ formData, prevStep, handleSubmit }) => {
    return (
        <div>
            <h2 className="text-light align-items-center justify-content-center ">Review Your Information</h2>
            <p className="text-light"><strong>Email:</strong> {formData.email}</p>
            <p className="text-light"><strong>First Name:</strong> {formData.firstname}</p>
            <p className="text-light"><strong>Last Name:</strong> {formData.lastname}</p>
            <p className="text-light"><strong>Username:</strong> {formData.username}</p>
            <p className="text-light"><strong>Password:</strong> (hidden for security)</p>
            <button className="btn btn-secondary mt-3" onClick={prevStep}>Back</button>
            <button className="btn btn-success mt-3 ms-2" onClick={handleSubmit}>Submit</button>
        </div>
    );
};
export default FinalStep;
