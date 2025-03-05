import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import FinalStep from './FinalStep';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/signup.css';

const Signup = () => {
    const [step, setStep] = useState(() => {
        return Number(localStorage.getItem("currentStep")) || 1;
    });

    useEffect(() => {
        // Save step in localStorage when it changes
        localStorage.setItem("currentStep", step);
    }, [step]);

    const [formData, setFormData] = useState({
        email: '',
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        image: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Function to handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Function to handle next step
    const nextStep = () => setStep((prevStep) => prevStep + 1);

    // Function to handle previous step
    const prevStep = () => setStep((prevStep) => prevStep - 1);

    // Function to handle final form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            console.log("filled data", formData);
            // const response = await axios.post('http://localhost:5500/users/postusers', {
            const response = await axios.post("https://mern-backend-acet.onrender.com/users/postusers", {
                Email: formData.email,
                Firstname: formData.firstname,
                Lastname: formData.lastname,
                Username: formData.username,
                Password: formData.password,
                Image: formData.image,
            });

            alert('Signup successful!');
            console.log("final to feed", response.data);

            if (response.data.token) {
                localStorage.setItem('auth_token', response.data.token);
            }
            navigate('/Login');

        } catch (error) {
            console.error('Error during signup!', error);
            setError(error.response?.data?.message || 'An error occurred!');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                {error && <div className="alert alert-danger">{error}</div>}
                {step === 1 && <StepOne formData={formData} handleChange={handleChange} nextStep={nextStep} />}
                {step === 2 && <StepTwo formData={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />}
                {step === 3 && <FinalStep formData={formData} prevStep={prevStep} handleSubmit={handleSubmit} />}
            </div>
        </div>
    );
};

export default Signup;
