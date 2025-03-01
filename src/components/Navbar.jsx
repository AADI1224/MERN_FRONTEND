import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../CSS/Navbar.css";
import icon from "../Vista Logos/user-icon.gif";

const Navbar = () => {
    const [showLogout, setShowLogout] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const firstname = localStorage.getItem("firstname");
    const navigate = useNavigate();
    const [userimage, setUserimage] = useState(icon);
    const logoutRef = useRef(null);
    const [isloggedout, setIsLoggedOut] = useState(false);

    useEffect(() => {
        const storedImage = localStorage.getItem("image");
        if (storedImage) {
            setUserimage(storedImage);
        }
    }, []);

    // Handle Scroll Effect on Navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Handle Logout
    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedOut(true);
    };

    useEffect(() => {
         if (isloggedout) {
            navigate("/login");
        }
    }, [isloggedout, navigate]);

    // Toggle Logout Button
    const handleLogoClick = (e) => {
        e.preventDefault();
        setShowLogout(!showLogout);
    };

    // Hide Logout Button when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (logoutRef.current && !logoutRef.current.contains(event.target)) {
                setShowLogout(false);
            }
        };

        if (showLogout) {
            document.addEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [showLogout]);

    // Dynamic Navbar Style on Scroll
    const navbarStyle = {
        backgroundColor: `rgba(255, 255, 255, ${0 + Math.min(scrollPosition / 500, 0.2)})`, 
        backdropFilter: `blur(${5 + Math.min(scrollPosition / 500, 5)}px)`, // Smooth blur effect
        transition: "background-color 1s ease-out, backdrop-filter 1s ease-out",
        willChange: "background-color, backdrop-filter",
    };
    
    return (
        <>
            <div className="navbar navbar-fixed d-flex" style={navbarStyle}>
                {/* Left Side: Logo (Optional) */}
                <div className="left_div d-flex align-items-center justify-content-center"> </div>

                {/* Right Side: User Icon */}
                <div ref={logoutRef} className={`user_icon d-flex flex-column align-items-center ${showLogout ? "show-logout" : ""}`}>
                    {/* Profile Image (Only opens the modal now) */}
                    <img
                        src={userimage}
                        alt="User"
                        className="user-icon-img"
                        onClick={() => setIsImageModalOpen(true)} // Open Image Modal
                        style={{ cursor: "pointer" }}
                    />

                    <h1 className="username-text d-flex" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
                        भीखमँगिया {firstname}
                    </h1>

                    {showLogout && (
                        <button className="btn-danger logout_button" onClick={handleLogout}>
                            Logout
                        </button>
                    )}
                </div>
            </div>

            {/* Full-Screen Image Modal */}
            {isImageModalOpen && (
                <div className="image-modal" onClick={() => setIsImageModalOpen(false)}>
                    <img src={userimage} alt="Full Profile" className="full-image" />
                </div>
            )}
        </>
    );
};

export default Navbar;