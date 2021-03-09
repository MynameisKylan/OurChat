import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Login from "../components/login";
import SignUp from "../components/SignUp";
import Home from "../components/Home";
import Conversations from "../components/Conversations";

const app = () => {
  // https://stackoverflow.com/questions/43164554/how-to-implement-authenticated-routes-in-react-router-4
  function PrivateRoute({ component: Component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          localStorage.getItem("loggedIn") ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{ pathname: "/login", state: { redirected: true } }}
            />
          )
        }
      />
    );
  }

  return (
    <Switch>
      <Route
        exact
        path="/"
        render={(props) =>
          localStorage.getItem("currentUser") ? (
            <Redirect to={{ pathname: "/conversations" }} {...props} />
          ) : (
            <Home />
          )
        }
      />
      <Route
        exact
        path="/signup"
        render={(props) =>
          localStorage.getItem("currentUser") ? (
            <Redirect to={{ pathname: "/conversations" }} {...props} />
          ) : (
            <SignUp />
          )
        }
      />
      <Route
        exact
        path="/login"
        render={(props) =>
          localStorage.getItem("currentUser") ? (
            <Redirect to={{ pathname: "/conversations" }} {...props} />
          ) : (
            <Login />
          )
        }
      />
      <PrivateRoute path="/conversations" component={Conversations} />
    </Switch>
  );
};

export default app;
