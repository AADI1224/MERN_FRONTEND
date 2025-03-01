import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../CSS/homepage.css";

const HomePage = () => {
  const isAuthenticated = !!localStorage.getItem("auth_token");

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <div className="hero-container">
        <div className="hero">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            कार्यसेतु
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            Stay Organized. Stay Productive.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn dashboard-btn">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn login-btn">
                  Login
                </Link>
                <Link to="/signup" className="btn signup-btn">
                  Sign Up
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </div>


      {/* Features Section */}
      <section className="features">
        <h2 className="features-title">Why Choose कार्यसेतु ?</h2>
        {/* <div className="features-grid">
          {[
            {
              title: "📅 Task Management",
              description: "Create, edit, and organize your tasks easily.",
            },
            {
              title: "⏰ Reminders & Deadlines",
              description: "Never miss an important task with reminders.",
            },
            {
              title: "📊 Progress Tracking",
              description: "Visualize your productivity with smart analytics.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.8 }}
            >
              <h4 className="feature-title">{feature.title}</h4>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div> */}
        <p>आपको चूतिया बनाया गया है</p>
      </section>

      {/* Footer */}
      <footer className="footer">
          <p>&copy; 2025 कार्यसेतु All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
