import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Config from '../../commons/config/Config.js';
import FormValidation from '../../commons/validation/FormValidation.js'
import Validator from '../../commons/validation/Validator.js'
import Loading from '../ui/Loading.js'
import swal from 'sweetalert'

class Activate extends Component {
	constructor(props) {
		super(props);

		this.state = {
			formData: {
				clave: null,
				claveReingresada: null,
				claveActivacionCodigo: props.match.params.activationKey,
			},
			persona: null,
			activationKeyValid: null,
			passwordCreated: null,
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
				'formData.clave': (value) => Validator.notEmpty(value),
				'formData.claveReingresada': (value) => Validator.notEmpty(value)
			}
		});
	}

	componentDidMount () {
		document.body.className = 'vertical-layout vertical-menu 1-column menu-expanded blank-page blank-page bg-full-screen-image';
		document.body.setAttribute('data-col', '1-column');

		fetch(Config.get('apiUrlBase') + '/public/auth/persona/' + this.state.formData.claveActivacionCodigo , {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).then(response => {
			if(response.status === 200) {
				response.json()
				.then(data => {
					this.setState({ 
						persona: data,
						activationKeyValid: true
					}, () => {
						this.refs.clave.focus();
					});
				});
			} else if(response.status === 400) {
				response.json()
				.then(data => {
					this.setState({	
						errors: data.detalle,
						activationKeyValid: false
					});
				}).catch(error => {
					this.error();
				});
			} else {
				this.error();
			}
		}).catch((error) => {
			this.error();
		}).finally(() => {
			this.setState({ loading: false });
		});
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
		if(this.state.formData.clave !== this.state.formData.claveReingresada) {
			this.setState({	errors: ['Las contraseñas ingresadas no coinciden.'] });
		} else {
			this.setState({ loading: true });
			this.setState({	errors: [] });

			fetch(Config.get('apiUrlBase') + '/public/auth/activate/' + this.state.formData.claveActivacionCodigo, {
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
						passwordCreated: true
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
		}

		event.preventDefault();
	}

	handleGoHome() {
		this.setState({
	      redirectTo: '/'
	    });
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
					{this.state.activationKeyValid != null ? (
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

											{this.state.activationKeyValid === true && !this.state.passwordCreated ? (
											<React.Fragment>
												<p className="card-subtitle line-on-side text-muted text-center font-small-3 mx-2">
													<span>Creación de contraseña</span>
												</p>
												<div className="card-content">
													<div className="card-body">
														<p>Bienvenido <b>{this.state.persona.nombre + ' ' + this.state.persona.apellido}</b>. Su nombre de usuario es <b>{this.state.persona.usuario}</b>.</p>
														<p>A continuación ingrese una contraseña para activar su cuenta en Fleet.</p>
														<form className="form-horizontal" noValidate ref="form" onSubmit={this.handleSubmit}>
															<input type="text" id="username" name="username" value={this.state.persona.usuario} hidden="true" />
															<fieldset className="form-group position-relative has-icon-left">
																<input type="password" className="form-control form-control-lg input-lg" id="clave" name="clave" placeholder="Contraseña nueva" ref="clave" tabIndex="2" required onChange={this.handleFormChange} />
																<div className="form-control-position">
																	<i className="la la-key"></i>
																</div>
																<div className="help-block text-danger font-small-3" hidden={validationState.formData.clave.pristine || validationState.formData.clave.valid}>{validationState.formData.clave.message}</div>
															</fieldset>
															<fieldset className="form-group position-relative has-icon-left">
																<input type="password" className="form-control form-control-lg input-lg" id="claveReingresada" name="claveReingresada" placeholder="Reingrese la contraseña" tabIndex="2" required onChange={this.handleFormChange} />
																<div className="form-control-position">
																	<i className="la la-key"></i>
																</div>
																<div className="help-block text-danger font-small-3" hidden={validationState.formData.claveReingresada.pristine || validationState.formData.claveReingresada.valid}>{validationState.formData.claveReingresada.message}</div>
															</fieldset>
															<div className="alert alert-danger" role="alert" hidden={this.state.errors.length===0}>
																{this.state.errors.map((e, i) => <li key={i}>{e}</li>)}
															</div>
															<button type="submit" className="btn btn-outline-primary btn-lg btn-block" disabled={!validationState.form.valid}><i className={this.state.loading ? 'la la-spinner spinner' : 'la la-lock'}></i> Enviar</button>
															<div className="row mt-2">
																<div className="col-6"><img src="./images/company/logo-login-company.png" alt="" className="img-fluid center-block" /></div>
																<div className="col-6 text-right"><img src="./images/company/logo-login-powered-by.png" alt="" className="img-fluid center-block" /></div>
															</div>
														</form>
													</div>
												</div>
											</React.Fragment>
											) : ''}

											{this.state.activationKeyValid === false && !this.state.passwordCreated ? (
											<React.Fragment>
												<p className="card-subtitle line-on-side text-muted text-center font-small-3 mx-2"></p>
												<div className="text-center"><i className="fa fa-5x fa-frown-o" style={{color:'#d9534f'}}></i></div>
										        <h1 className="text-center">
										        	<p>
										        		<small className="text-center">
															{this.state.errors.map((e, i) => <p key={i}>{e}</p>)}
										        		</small>
										        	</p>
										        </h1>
										        <p className="text-center">Contacte al administrador.</p>
											</React.Fragment>
									        ) : ''}

									        {this.state.passwordCreated ? (
									        <React.Fragment>
									        	<p className="card-subtitle line-on-side text-muted text-center font-small-3 mx-2"></p>
												<div className="text-center"><i className="fa fa-5x fa-smile" style={{color:'#00c0bd'}}></i></div>
										        <h1 className="text-center">
										        	<p>
										        		<small className="text-center">
															Su cuenta ha sido creada!
										        		</small>
										        	</p>
										        </h1>
										        <button type="submit" className="btn btn-outline-primary btn-lg btn-block" onClick={this.handleGoHome.bind(this)}><i className="la la-home"></i> Acceder a Fleet</button>
											</React.Fragment>
									        ) : ''}

										</div>
									</div>
								</div>
							</section>
						</div>
					</div>
					) : ''}
				</div>
			</React.Fragment>
	    );
  	}
}

export default Activate;