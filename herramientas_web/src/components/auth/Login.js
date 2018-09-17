import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Config from '../../commons/config/Config.js';
import FormValidation from '../../commons/validation/FormValidation.js'
import Validator from '../../commons/validation/Validator.js'
import Loading from '../ui/Loading.js'
import swal from 'sweetalert'

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			formData: {
				usuario: null,
				clave: null
			},
			errors: [],
			loading: false,
			redirectTo: null
		}

		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleForgotPassword = this.handleForgotPassword.bind(this);
	}

	componentWillMount () {
		this.formValidation = new FormValidation({
			component: this,
			validators: {
				'formData.usuario': (value) => Validator.notEmpty(value),
				'formData.clave': (value) => Validator.notEmpty(value)
			}
		});
	}

	componentDidMount () {
		document.body.className = 'vertical-layout vertical-menu 1-column menu-expanded blank-page blank-page bg-full-screen-image';
		document.body.setAttribute('data-col', '1-column');

		this.refs.usuario.focus();
	}

	handleFormChange(event) {
		const target = event.target;
		const name = target.name;
		const value = target.type === 'checkbox' ? target.checked : target.value;

		let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy[name] = value;
		this.setState({	formData: formDataCopy });
	}

	handleSubmit(event) {
		this.setState({ loading: true });
		this.setState({	errors: [] });

		fetch(Config.get('apiUrlBase') + '/public/auth/login', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...this.state.formData
			}),
		}).then(response => {
			if(response.status === 200) {
				response.json()
				.then(data => {
					if(data && data.usuario && data.usuario.token) {
						localStorage.setItem('persona', JSON.stringify(data));
						localStorage.setItem('token', data.usuario.token);
						window.location.reload();
					} else {
						this.error();
					}
				});
			} else if(response.status === 401) {
				response.json()
				.then(data => {
					this.setState({	errors: data.detalle });
				});
			} else {
				this.error();
			}
		}).catch((error) => {
			this.error();
		}).finally(() => {
			this.setState({ loading: false });
		});

		event.preventDefault();
	}

	handleForgotPassword(e) {
		this.setState({
			redirectTo: '/olvide-clave'
		});

		e.preventDefault();
	}

	error() {
		swal({
			title: "Error interno del sistema.",
			text: "Contacte al administrador.",
			icon: "error",
			buttons: {
				confirm: {
					text: "Aceptar",
					value: true,
					visible: true,
					className: "btn btn-primary",
					closeModal: true
				}
			}
		});
	}

	render() {
		this.formValidation.validate();
		let validationState = this.formValidation.state;

	    return (
	    	<React.Fragment>
	    		{this.state.redirectTo && <Redirect push to={this.state.redirectTo} />}
		    	{this.state.loading && <Loading hideSpinner />}
				<div className="app-content content">
					<div className="content-wrapper">
						<div className="content-header row">
						</div>
						<div className="content-body">
							<section className="flexbox-container">
								<div className="col-12 d-flex align-items-center justify-content-center">
									<div className="col-md-4 col-10 box-shadow-2 p-0">
										<div className="card border-grey border-lighten-3 px-2 py-2 m-0">
											<div className="card-header border-0 text-center">
												<img src="./images/company/logo-login-app.png" alt="" className="rounded-circle img-fluid center-block" />
											</div>
											<p className="card-subtitle line-on-side text-muted text-center font-small-3 mx-2">
												<span>Ingrese sus credenciales</span>
											</p>
											<div className="card-content">
												<div className="card-body">
													<form className="form-horizontal" noValidate ref="form" onSubmit={this.handleSubmit}>
														<fieldset className="form-group position-relative has-icon-left">
															<input type="text" className="form-control form-control-lg input-lg" id="usuario" name="usuario" ref="usuario" placeholder="Usuario" tabIndex="1" required="" data-validation-required-message="Por favor ingrese su usuario." aria-invalid="false" onChange={this.handleFormChange} />
															<div className="form-control-position">
																<i className="la la-user"></i>
															</div>
															<div className="help-block text-danger font-small-3" hidden={validationState.formData.usuario.pristine || validationState.formData.usuario.valid}>{validationState.formData.usuario.message}</div>
														</fieldset>
														<fieldset className="form-group position-relative has-icon-left">
															<input type="password" className="form-control form-control-lg input-lg" id="clave" name="clave" placeholder="Contraseña" tabIndex="2" required onChange={this.handleFormChange} />
															<div className="form-control-position">
																<i className="la la-key"></i>
															</div>
															<div className="help-block text-danger font-small-3" hidden={validationState.formData.clave.pristine || validationState.formData.clave.valid}>{validationState.formData.clave.message}</div>
														</fieldset>
														<div className="form-group row">
															<div className="col-12 float-sm-left text-center text-sm-right"><a href="" className="card-link primary" onClick={e => this.handleForgotPassword(e)}><i className="ft-unlock"></i> Olvidó su contraseña?</a></div>
														</div>
														<div className="alert alert-danger" role="alert" hidden={this.state.errors.length===0}>
															{this.state.errors.map((e, i) => <li key={i}>{e}</li>)}
														</div>
														<button type="submit" className="btn btn-outline-primary btn-lg btn-block" disabled={!validationState.form.valid}><i className={this.state.loading ? 'la la-spinner spinner' : 'la la-lock'}></i> Ingresar</button>
														<div className="row mt-2">
															<div className="col-6"><img src="./images/company/logo-login-company.png" alt="" className="img-fluid center-block" /></div>
															<div className="col-6 text-right"><img src="./images/company/logo-login-powered-by.png" alt="" className="img-fluid center-block" /></div>
														</div>
													</form>
												</div>
											</div>
										</div>
									</div>
								</div>
							</section>
						</div>
					</div>
				</div>
			</React.Fragment>
	    );
  	}
}

export default Login;