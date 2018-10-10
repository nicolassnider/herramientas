import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, FormFeedback, Input, InputGroup, InputGroupAddon, InputGroupText, Row, CardImg } from 'reactstrap';
import logo from '../../../assets/img/brand/logo.svg'
import { login, isLoggedIn } from '../../../services/AuthServices';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      usuario: {
        value: '',
        isValid: false,
        touched: false
      },
      password: {
        value: '',
        isValid: false,
        touched: false
      },
      tryLogin: false,
      loginError: ''
    }
  }

  handleChangeUsuario = event => {
    const value = event.target.value;
    this.setState({
      usuario: {
        value: value,
        touched: true,
        isValid: value.length > 0
      },
      tryLogin: false
    });
  }

  handleChangePassword = event => {
    const value = event.target.value;
    this.setState({
      password: {
        value: value,
        touched: true,
        isValid: value.length > 0
      },
      tryLogin: false
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    let payload = {
      usuario: this.state.usuario.value,
      clave: this.state.password.value
    };
 
    login(payload.usuario, payload.clave)
    .then(result => {
      this.setState({
        loginError: result.message,
        tryLogin: true,
      })
    });
  } 

  render() {
    
    if (isLoggedIn()) {
      window.location.reload();
    }


    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <CardGroup>
                <Card className="p-4">
                  <CardImg top src={logo} alt="Card image cap" />
                  <CardBody>
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
                          value={this.state.usuario.value}
                          onChange={this.handleChangeUsuario} 
                          valid={this.state.usuario.isValid && this.state.usuario.touched}
                          invalid={!this.state.usuario.isValid && this.state.usuario.touched} />
                        {/* <FormFeedback className="text-center">El usuario es obligatorio</FormFeedback> */}
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
                          value={this.state.password.value}
                          onChange={this.handleChangePassword} 
                          valid={this.state.password.isValid && this.state.password.touched}
                          invalid={!this.state.password.isValid && this.state.password.touched} />
                        {/* <FormFeedback className="text-center">La contraseña es obligatoria</FormFeedback> */}
                      </InputGroup>
                      { this.state.tryLogin && this.state.loginError.length > 0 && <p>{ this.state.loginError }</p>}
                      <Row>
                        <Col md="4">
                          <Button 
                            color="primary"
                            className="px-4 btn-custom-block"
                            type="submit"
                            disabled={!this.state.usuario.isValid || !this.state.password.isValid}>Ingresar</Button>
                        </Col>
                        <Col md="8" className="text-right">
                          <Button color="link" className="px-0 btn-custom-block">Recordar contraseña</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                {/* <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Button color="primary" className="mt-3" active>Register Now!</Button>
                    </div>
                  </CardBody>
                </Card> */}
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
