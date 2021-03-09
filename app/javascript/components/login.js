import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Error from "./Error";

const Login = (props) => {
  const [user, setUser] = useState({ email: "", password: "" });
  const redirected = props.location.state
    ? props.location.state.redirected
    : false;
  const [errorMessage, setErrorMessage] = useState(
    redirected ? "You must be signed in to view this page." : ""
  );
  const history = useHistory();
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/users/sign_in", {
        user: user,
      })
      .then((resp) => {
        console.log(resp)
        if (resp.data.user) {
          localStorage.setItem("currentUser", resp.data.user);
          history.push("/");
        } else {
          setErrorMessage("Invalid email or password");
          setUser({ ...user, password: "" });
        }
      });
  };

  return (
    <>
      <div className="header">
        <h1>Chat</h1>
      </div>
      <div className="content-wrapper">
        <h2>Login</h2>
        {errorMessage ? <Error message={errorMessage} /> : null}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Email Address"
          />
          <br />
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="Password"
          />
          <br />
          <button type="submit" className="register-button">
            Sign In
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
