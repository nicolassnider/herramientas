import React from "react";
import { Redirect, Route } from "react-router-dom";
import { isAuthenticated } from "../services/AuthServices";
import { hasAllPermissions } from "../utils/ValidatePermissions";

const PrivateRoute = ({ component: Component, permissions,  ...rest }) => (
    <Route {...rest} render={(props) => (
        isAuthenticated() && (permissions === undefined || hasAllPermissions(permissions))
        ? <Component {...props} />
        : <Redirect to={{
            pathname: '/auth',
            state: { from: props.location }
        }} />
    )} />
)

export default PrivateRoute;