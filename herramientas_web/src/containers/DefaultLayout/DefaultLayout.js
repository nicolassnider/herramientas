import React, { Component } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import PrivateRoute from '../../hoc/PrivateRoute';

import {
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';
import { hasAllPermissions } from '../../utils/ValidatePermissions';

class DefaultLayout extends Component {
  render() {

    const { items } = navigation;
    const customNavigation = {
      items: []
    };
    items.map((item, index) => {
      if (item && (!item.permissions || hasAllPermissions(item.permissions)))
        customNavigation.items.push(item); 
    });

    return (
      <div className="app">
        <AppHeader fixed>
          <DefaultHeader />
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <AppSidebarNav navConfig={customNavigation} {...this.props} />
            <AppSidebarFooter />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes}/>
            <Container fluid>
              <Switch>
                { routes.map((route, idx) => {
                    return route.component 
                      ? (<PrivateRoute 
                          key={idx}
                          path={route.path}
                          exact={route.exact}
                          name={route.name}
                          component={route.component}
                          permissions={route.permissions}/>)
                      : (null);
                  },
                )}
                <Redirect from="/" to="/calendario" />
              </Switch>
            </Container>
          </main>
        </div>
        <AppFooter>
          <DefaultFooter />
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
