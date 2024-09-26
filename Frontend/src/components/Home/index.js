import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Welcome to My Todo Application!</h1>
      <p className="homepage-description">
        Keep your tasks organized and boost your productivity with our
        easy-to-use Todo application.
      </p>

      <section className="features-section">
        <h2>Features</h2>
        <ul className="features-list">
          <li>✔️ Add, edit, and delete tasks</li>
          <li>✔️ Organize tasks by status: Pending, In Progress, Done</li>
          <li>✔️ User authentication for personalized experience</li>
          <li>✔️ Easy navigation between your tasks and profile</li>
          <li>✔️ Responsive design for mobile and desktop</li>
        </ul>
      </section>

      <section className="usage-section">
        <h2>How to Use</h2>
        <p>1. Sign up for a new account or log in if you already have one.</p>
        <p>2. Add new tasks with titles and status.</p>
        <p>3. Update task status as you progress.</p>
        <p>4. Delete tasks when you no longer need them.</p>
      </section>

      <div className="cta-section">
        <h2>Get Started Today!</h2>
        <Link to="/signup" className="cta-button">
          Sign Up
        </Link>
        <Link to="/login" className="cta-button">
          Login
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
