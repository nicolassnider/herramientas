import React, {Component} from 'react';
import {Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink} from 'reactstrap';
import {DropdownItemLogout} from '../../components/Auth/Logout';
import * as storage from '../../utils/Storage';
import PropTypes from 'prop-types';

import {AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler} from '@coreui/react';
import logo from '../../assets/img/brand/logo.svg'
import logoChico from '../../assets/img/brand/logo-chico.svg'

const propTypes = {
    children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {

    render() {

        // eslint-disable-next-line
        const {children, ...attributes} = this.props;
        const user = storage.getUser();

        return (
            <React.Fragment>
                <AppSidebarToggler className="d-lg-none" display="md" mobile/>
                <AppNavbarBrand
                    full={{src: logo, height: 60, alt: 'IRAM Logo'}}
                    minimized={{src: logoChico, width: 30, height: 30, alt: 'IRAM Logo'}}
                />
                <Nav className="ml-auto" navbar>
                    <AppHeaderDropdown direction="down">
                        <DropdownToggle nav>
                            <strong className="d-sm-down-none" display="md">{user.nombre} {user.apellido}</strong>
                            <img src={'assets/img/avatars/6.jpg'} className="img-avatar"
                                 alt="admin@bootstrapmaster.com"/>
                        </DropdownToggle>
                        <DropdownMenu right style={{right: 'auto'}}>
                            <DropdownItem><i className="fa fa-user"></i> Mi cuenta</DropdownItem>
                            <DropdownItemLogout pepe="test"><i className="fa fa-lock"></i> Cerrar
                                sesión</DropdownItemLogout>
                        </DropdownMenu>
                    </AppHeaderDropdown>
                </Nav>
            </React.Fragment>
        );
    }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
