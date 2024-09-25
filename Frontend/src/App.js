import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import TodoList from "./components/TodoList";
import Profile from "./components/Profile";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/todos" component={TodoList} />
          <Route exact path="/profile" component={Profile} />
        </Switch>
      </Router>
    );
  }
}

export default App;
