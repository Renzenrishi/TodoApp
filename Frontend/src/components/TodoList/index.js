import React, { Component } from "react";
import Cookies from "js-cookie";
import { withRouter } from "react-router-dom";
import "./index.css"; // Ensure to import the CSS file

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      newTask: "",
      status: "pending",
      error: "", // Add an error state
    };
  }

  componentDidMount() {
    this.fetchTasks();
  }

  fetchTasks = async () => {
    const token = Cookies.get("jwt_token");

    if (!token) {
      alert("You need to login first.");
      this.props.history.replace("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/tasks", {
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        const tasks = await response.json();
        this.setState({ tasks });
      } else {
        alert("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks", error);
      this.setState({ error: "Failed to fetch tasks." });
    }
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleAddTask = async () => {
    const { newTask, status } = this.state;
    const token = Cookies.get("jwt_token");

    if (!newTask) {
      alert("Task title cannot be empty.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ title: newTask, status }),
      });

      if (response.ok) {
        this.setState({ newTask: "", status: "pending" });
        this.fetchTasks();
      } else {
        alert("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task", error);
      this.setState({ error: "Failed to add task." });
    }
  };

  handleDeleteTask = async (taskId) => {
    const token = Cookies.get("jwt_token");

    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        this.fetchTasks();
      } else {
        alert("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task", error);
      this.setState({ error: "Failed to delete task." });
    }
  };

  handleToggleStatus = async (task) => {
    const token = Cookies.get("jwt_token");
    const newStatus = task.status === "done" ? "pending" : "done";

    try {
      const response = await fetch(`http://localhost:5000/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ title: task.title, status: newStatus }),
      });

      if (response.ok) {
        this.fetchTasks();
      } else {
        alert("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task", error);
      this.setState({ error: "Failed to update task status." });
    }
  };

  handleLogout = () => {
    Cookies.remove("jwt_token");
    this.props.history.replace("/login");
  };

  handleProfile = () => {
    this.props.history.push("/profile");
  };

  render() {
    return (
      <div className="todo-container">
        <h2>Your TODOs</h2>
        {this.state.error && (
          <p className="error-message">{this.state.error}</p>
        )}
        <div className="button-container">
          <button className="button" onClick={this.handleLogout}>
            Logout
          </button>
          <button className="button" onClick={this.handleProfile}>
            Profile
          </button>
        </div>

        <div className="task-input-container">
          <input
            type="text"
            name="newTask"
            value={this.state.newTask}
            onChange={this.handleInputChange}
            placeholder="New task title"
            className="task-input"
          />
          <select
            name="status"
            value={this.state.status}
            onChange={this.handleInputChange}
            className="status-select"
          >
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button onClick={this.handleAddTask} className="add-task-button">
            Add Task
          </button>
        </div>
        <ul className="tasks-container">
          {this.state.tasks.map((task) => (
            <li key={task.id} className={`task-item ${task.status}`}>
              <div>
                <input
                  type="checkbox"
                  checked={task.status === "done"}
                  onChange={() => this.handleToggleStatus(task)}
                />
                {task.title} - {task.status}
              </div>
              <button
                onClick={() => this.handleDeleteTask(task.id)}
                className="delete-button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default withRouter(TodoList);
