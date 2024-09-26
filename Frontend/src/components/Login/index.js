import React, { Component } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import "./index.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    const { email, password } = this.state;

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set("jwt_token", data.token, { expires: 1 });
        alert("Login successful");
        this.props.history.push("/todos");
      } else {
        this.setState({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error logging in", error);
      this.setState({ error: "An error occurred. Please try again." });
    }
  };

  render() {
    return (
      <div className="login-container">
        <h2>Login</h2>
        <form className="login-form" onSubmit={this.handleSubmit}>
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
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        {this.state.error && (
          <p className="error-message">{this.state.error}</p>
        )}
        <Link to="/signup" className="signup-link">
          Don't have an account? Sign Up
        </Link>
      </div>
    );
  }
}

export default Login;
