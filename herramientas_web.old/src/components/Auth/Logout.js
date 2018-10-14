import React from "react";
import { withRouter } from "react-router-dom";
import { DropdownItem } from 'reactstrap';
import { logout, isAuthenticated } from "../../services/AuthServices";
import { clearToken }  from '../../utils/Storage';

const handleLogout = (history) => {
    logout() 
    .finally(() => {
      clearToken();
    })
    .then(() => history.push('/'));
  }

export const DropdownItemLogout = withRouter(({ history, children }) =>
        isAuthenticated()
        ? <DropdownItem onClick={() => handleLogout(history)}>{children}</DropdownItem>
        : null
);