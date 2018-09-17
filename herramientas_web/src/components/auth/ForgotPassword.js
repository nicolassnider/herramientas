import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Config from '../../commons/config/Config.js';
import FormValidation from '../../commons/validation/FormValidation.js'
import Validator from '../../commons/validation/Validator.js'
import Loading from '../ui/Loading.js'
import swal from 'sweetalert'

class ForgotPassword extends Component {
	constructor(props) {
		super(props);

		this.state = {
			formData: {
				email: '',
			},
			emailSent: null,
			redirectTo: null,
			errors: [],
			loading: false
		}

		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentWillMount () {
		this.formValidation = new FormValidation({
			component: this,
			validators: {
				'formData.email': (value) => Validator.notEmpty(value)
			}
		});
	}

	componentDidMount () {
		document.body.className = 'vertical-layout vertical-menu 1-column menu-expanded blank-page blank-page bg-full-screen-image';
		document.body.setAttribute('data-col', '1-column');

		this.refs.email.focus();
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

		fetch(Config.get('apiUrlBase') + '/public/auth/forgot-password/' + this.state.formData.email, {
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
				this.setState({
					emailSent: true
				});
			} else {
				if(response.status === 400) {
					response.json()
					.then(data => {
						this.setState({	errors: data.detalle });
					}).catch(error => {
						this.error();
					})
				} else {
					this.error();
				}
			}
		}).catch((error) => {
			this.error();
		}).finally(() => {
			this.setState({ loading: false });
		});

		event.preventDefault();
	}

	handleGoHome(e) {
		this.setState({
	      redirectTo: '/'
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

											{!this.state.emailSent ? (
											<React.Fragment>
												<p className="card-subtitle line-on-side text-muted text-center font-small-3 mx-2">
													<span>Recuperación de contraseña</span>
												</p>
												<div className="card-content">
													<div className="card-body">
														<p>Ingrese su dirección de e-mail para recuperar su contraseña.</p>
														<form className="form-horizontal" noValidate ref="form" onSubmit={this.handleSubmit}>
															<fieldset className="form-group position-relative has-icon-left">
																<input type="text" className="form-control form-control-lg input-lg" id="email" name="email" placeholder="E-mail" ref="email" tabIndex="2" required onChange={this.handleFormChange} />
																<div className="form-control-position">
																	<i className="la la-at"></i>
																</div>
																<div className="help-block text-danger font-small-3" hidden={validationState.formData.email.pristine || validationState.formData.email.valid}>{validationState.formData.email.message}</div>
															</fieldset>
															<div className="alert alert-danger" role="alert" hidden={this.state.errors.length===0}>
																{this.state.errors.map((e, i) => <li key={i}>{e}</li>)}
															</div>
															<button type="submit" className="btn btn-outline-primary btn-lg btn-block" disabled={!validationState.form.valid}><i className={this.state.loading ? 'la la-spinner spinner' : 'la la-check'}></i> Enviar</button>
															<div className="form-group row mt-2">
																<div className="col-md-6 col-12 text-center text-sm-left">
																	<a href="" class="card-link primary" onClick={this.handleGoHome.bind(this)}><i class="la la-chevron-circle-left"></i> <span class="align-top">Volver al inicio</span></a>
																</div>
															</div>
															<div className="row mt-2">
																<div className="col-6"><img src="./images/company/logo-login-company.png" alt="" className="img-fluid center-block" /></div>
																<div className="col-6 text-right"><img src="./images/company/logo-login-powered-by.png" alt="" className="img-fluid center-block" /></div>
															</div>
														</form>
													</div>
												</div>
											</React.Fragment>
											) : ''}

											{this.state.emailSent ? (
									        <React.Fragment>
									        	<p className="card-subtitle line-on-side text-muted text-center font-small-3 mx-2"></p>
												<div className="text-center"><i className="la la-envelope" style={{fontSize: '80px', color:'#00c0bd'}}></i></div>
										        <h1 className="text-center">
										        	<p>
										        		<small className="text-center">
															Le enviamos un e-mail!
										        		</small>
										        	</p>
										        </h1>
										        <p className="text-center">Verifique su casilla de e-mail. Le enviamos las instrucciones para cambiar su contraseña.</p>
											</React.Fragment>
									        ) : ''}

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

export default ForgotPassword;