import React, { Component } from "react";
import Cookies from "js-cookie";
import { withRouter } from "react-router-dom";
import "./index.css"; // Make sure to import the CSS file

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      error: "",
      success: "",
    };
  }

  componentDidMount() {
    this.fetchProfile();
  }

  fetchProfile = async () => {
    const token = Cookies.get("jwt_token");

    if (!token) {
      alert("You need to login first.");
      this.props.history.replace("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/profile", {
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        const profile = await response.json();
        this.setState({ name: profile.name, email: profile.email });
      } else {
        alert("Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching profile", error);
    }
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleUpdateProfile = async (e) => {
    e.preventDefault();
    const { name, email, password } = this.state;
    const token = Cookies.get("jwt_token");

    try {
      const response = await fetch("http://localhost:5000/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        this.setState({ success: "Profile updated successfully!" });
      } else {
        this.setState({ error: "Failed to update profile. Try again." });
      }
    } catch (error) {
      console.error("Error updating profile", error);
      this.setState({ error: "An error occurred. Please try again." });
    }
  };

  render() {
    return (
      <div className="profile-container">
        <h2>Your Profile</h2>
        {this.state.success && (
          <p className="success-message">{this.state.success}</p>
        )}
        {this.state.error && (
          <p className="error-message">{this.state.error}</p>
        )}

        <form className="profile-form" onSubmit={this.handleUpdateProfile}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.handleInputChange}
              required
              className="input-field"
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.handleInputChange}
              required
              className="input-field"
            />
          </label>
          <br />
          <label>
            New Password:
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleInputChange}
              placeholder="New password"
              className="input-field"
            />
          </label>
          <br />
          <button type="submit" className="update-button">
            Update Profile
          </button>
        </form>
      </div>
    );
  }
}

export default withRouter(Profile);
