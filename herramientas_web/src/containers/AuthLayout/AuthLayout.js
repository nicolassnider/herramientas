import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Card, CardBody, Col, CardImg, CardGroup, Container, Row } from 'reactstrap';

import { isAuthenticated } from '../../services/AuthServices';
import logo from '../../assets/img/brand/logo.svg';

import { Login, ForgotPassword, RecoverPassword, Activate } from '../../components/Auth';

class AuthLayout extends Component {
    render() {

        const { from } = this.props.location.state || { from: { pathname: '/' } }

        if (isAuthenticated()) {
            return (<Redirect to={from} />);
        }

        return (
            <div className="app flex-row align-items-center">
                <Container>
                    <Row className="justify-content-center">
                        <Col md="6">
                            <CardGroup>
                                <Card className="p-4">
                                    <Container style={{ textAlign: "center" }}>
                                        <CardImg src={logo} alt="Card image cap" className="card-img-width" />
                                    </Container>
                                    <CardBody>
                                        <Switch>
                                            <Route path="/auth" exact component={Login} />
                                            <Route path='/auth/activate/:activationKey' component={Activate} />
						                    <Route path='/auth/forgotPassword' component={ForgotPassword} />
						                    <Route path='/auth/recoverPassword/:activationKey' component={RecoverPassword} />
                                        </Switch>
                                    </CardBody>
                                </Card>
                            </CardGroup>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default AuthLayout;