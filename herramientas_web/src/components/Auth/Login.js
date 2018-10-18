import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {Button, Col, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row} from 'reactstrap';
import {login, isAuthenticated} from '../../services/AuthServices';
import * as storage from '../../utils/Storage';
import FormValidation from '../../utils/FormValidation';
import Validator from '../../utils/Validator';

class Login extends Component {

    handleChangeUsuario = event => {
        const value = event.target.value;
        this.setState({
            usuario: value,
            tryLogin: false
        });
    }
    handleChangeClave = event => {
        const value = event.target.value;
        this.setState({
            clave: value,
            tryLogin: false
        });
    }
    handleSubmit = (event) => {
        event.preventDefault();

        login(this.state.usuario, this.state.clave)
            .catch(error => {
                return {
                    isAuthenticated: false,
                    message: "Se ha producido un error. Intente nuevamente"
                };
            })
            .then(response => {
                const data = response.json();

                return Promise.all([response, data]);
            })
            .then(([response, data]) => {
                const statusCode = response.status;
                if (statusCode === 200) {
                    storage.setUser(data);
                    storage.setToken(data.usuario.token);
                    return {
                        isAuthenticated: true,

                        message: ''
                    };
                }
                return {
                    isAuthenticated: false,
                    message: data.mensaje
                };
            })
            .then(result => {
                this.setState({
                    loginError: result.message,
                    tryLogin: true,
                });
            });
    }

    constructor(props) {
        super(props);
        this.state = {
            usuario: '',
            clave: '',
            tryLogin: false,
            loginError: ''
        }
        this.formValidation = new FormValidation({
            component: this,
            validators: {
                'usuario': (value) => Validator.notEmpty(value),
                'clave': (value) => Validator.notEmpty(value)
            }
        });
    }

    render() {

        const {from} = this.props.location.state || {from: {pathname: '/'}}

        if (isAuthenticated()) {
            return (<Redirect to={from}/>);
        }

        this.formValidation.validate();
        let validationState = this.formValidation.state;

        return (
            <Form className="login" onSubmit={this.handleSubmit}>
                <h1>Ingresar</h1>
                <p className="text-muted">Inicie sesión en su cuenta</p>
                <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <i className="icon-user"></i>
                        </InputGroupText>
                    </InputGroupAddon>
                    <Input
                        type="text"
                        placeholder="Usuario"
                        autoComplete="usuario"
                        value={this.state.usuario}
                        onChange={this.handleChangeUsuario}
                        valid={!validationState.usuario.pristine && validationState.usuario.valid}
                        invalid={!validationState.usuario.pristine && !validationState.usuario.valid}/>
                </InputGroup>
                <InputGroup className="mb-4">
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <i className="icon-lock"></i>
                        </InputGroupText>
                    </InputGroupAddon>
                    <Input
                        type="password"
                        placeholder="Contraseña"
                        autoComplete="contrasena-actual"
                        value={this.state.clave}
                        onChange={this.handleChangeClave}
                        valid={!validationState.clave.pristine && validationState.clave.valid}
                        invalid={!validationState.clave.pristine && !validationState.clave.valid}/>
                </InputGroup>
                {this.state.tryLogin && this.state.loginError.length > 0 && <p>{this.state.loginError}</p>}
                <Row>
                    <Col md="4">
                        <Button
                            color="primary"
                            className="px-4 btn-custom-block"
                            type="submit"
                            disabled={!validationState.form.valid}>Ingresar</Button>
                    </Col>
                    <Col md="8" className="text-right">
                        <Button
                            color="link"
                            className="px-0 btn-custom-block"
                            onClick={() => this.props.history.push('/auth/forgotpassword')}
                        >Recordar contraseña</Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Login;