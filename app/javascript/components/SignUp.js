import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import _ from "lodash";

import Error from "./Error";

const SignUp = (props) => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const history = useHistory();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/users", {
        user: user,
      })
      .then((resp) => {
        if (resp.data.user) {
          localStorage.setItem('loggedIn', true);

          // Redirects to home after retrieving token
          history.push("/");
        } else {
          setErrors(resp.data.errors);
          setUser({ ...user, password: "", password_confirmation: "" });
        }
      });
  };

  let errorComponents = null;
  if (errors) {
    const keys = Object.keys(errors);
    errorComponents = keys.map((key) => {
      const message = `${errors[key]}`;
      return <Error key={key} message={message} />;
    });
  }

  return (
    <>
      <div className="header">
        <h1>Chat</h1>
      </div>
      <div className="content-wrapper">
        <h2>Sign Up</h2>
        {errorComponents}
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            value={user.username}
            onChange={handleChange}
            placeholder="Username"
          />
          <br />
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
          <input
            type="password"
            name="password_confirmation"
            value={user.password_confirmation}
            onChange={handleChange}
            placeholder="Confirm Password"
          />
          <br />
          <button type="submit" className="register-button">
            Create Account
          </button>
        </form>
      </div>
    </>
  );
};

export default SignUp;
