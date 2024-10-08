import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import "./index.css"; // Import the CSS file

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      error: "",
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = this.state;

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        alert("User registered successfully!");
        this.props.history.replace("/login"); // Redirect to the login page after signup
      } else {
        this.setState({ error: "Registration failed. Try again!" });
      }
    } catch (error) {
      console.error("Error during signup", error);
      this.setState({ error: "An error occurred. Please try again." });
    }
  };

  render() {
    return (
      <div className="signup-body">
        <h2 className="signup-title">Signup</h2>
        <form className="signup-form" onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={this.state.name}
            onChange={this.handleInputChange}
            required
            className="input-field"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleInputChange}
            required
            className="input-field"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleInputChange}
            required
            className="input-field"
          />
          <button type="submit" className="signup-button">
            Signup
          </button>
        </form>
        {this.state.error && (
          <p className="error-message">{this.state.error}</p>
        )}
        <Link to="/login" className="login-link">
          Already a user? Login
        </Link>
      </div>
    );
  }
}

export default withRouter(Signup);
