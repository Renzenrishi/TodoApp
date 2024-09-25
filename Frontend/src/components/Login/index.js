import React, { Component } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

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
        Cookies.set("jwt_token", data.token, { expires: 1 }); // Store the token in cookies for 1 day
        alert("Login successful");
        this.props.history.push("/todos"); // Redirect to the TODO list page
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
      <div>
        <h2>Login</h2>
        <form onSubmit={this.handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleInputChange}
            required
          />
          <button type="submit">Login</button>
        </form>
        {this.state.error && <p style={{ color: "red" }}>{this.state.error}</p>}
        <Link to="/signup">Don't have an account?Signup</Link>
      </div>
    );
  }
}

export default Login;
