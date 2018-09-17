import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import FormValidation from '../../commons/validation/FormValidation.js'
import Validator from '../../commons/validation/Validator.js'
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'
import Security from '../../commons/security/Security.js'
import Loading from '../ui/Loading.js'
import swal from 'sweetalert'

class ChangePassword extends Component {
	constructor(props) {
		super(props);

		this.ajaxHandler = new AjaxHandler();

		this.state = {
			redirectTo: null,
			props: this.props,
			formData: {
				claveActual: '',
				clave: '',
				claveReingresada: ''
			},
			errors: [],
			loading: false
		};

		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.formValidation = new FormValidation({
			component: this,
			validators: {
				'formData.claveActual': (value) => Validator.notEmpty(value),
				'formData.clave': (value) => Validator.notEmpty(value),
				'formData.claveReingresada': (value) => Validator.notEmpty(value)
			}
		});
	}

	componentDidMount() {
		this.ajaxHandler.subscribe(this);
	}

	componentWillUnmount() {
		this.ajaxHandler.unsubscribe();
	}

	handleFormChange(event) {
		const target = event.target;
		const name = target.name;
		const value = target.type === 'checkbox' ? target.checked : target.value;

		let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy[name] = value;
		this.setState({
			formData: formDataCopy
		});
	}

	handleSubmit(event) {
		let component = this

		if(this.state.formData.clave !== this.state.formData.claveReingresada) {
			this.setState({	errors: ['Las contraseñas ingresadas no coinciden.'] });
		} else {
			this.setState({ loading: true });
			this.setState({	errors: [] });

			this.ajaxHandler.fetch('/personas/change-password', {
				method: 'POST',
				body: JSON.stringify({
					...this.state.formData
				}),
			}).then(response => {
				if(response.status === 200) {
					this.passwordChanged();
				} else if(response.status === 400) {
					response.json()
					.then(data => {
						this.setState({
							errors: data.detalle
						});
					});
				}
				window.scrollTo(0,0);
			}).catch((error) => {
				component.ajaxHandler.handleError(error);
			}).finally(() => {
				component.setState({ loading: false });
			});
		}

		event.preventDefault();
	}

	passwordChanged() {
		swal({
			title: 'La contraseña fue modificada.',
			text: 'Por favor, vuelva a ingresar.',
			icon: "info",
			buttons: {
				confirm: {
					text: "Aceptar",
					value: true,
					visible: true,
					className: "btn btn-primary",
					closeModal: false
				}
			}
		})
		.then((isConfirm) => {
			if (isConfirm) {
				Security.logout();
			}
		});
	}

	render() {
		this.formValidation.validate();
		let formData = this.state.formData;
		let validationState = this.formValidation.state;
		let requiredSymbol = ' *';

		return (
			<React.Fragment>
				{this.state.redirectTo && <Redirect push to={this.state.redirectTo} />}
				{this.state.loading && <Loading />}
				<div className="content-wrapper">
					<div className="content-header row">
						<div className="content-header-left col-md-6 col-12 mb-2">
	      					<h3 className="content-header-title"><i className="la la-key ml-1 mr-1 align-middle"></i>Cambio de Contraseña</h3>
	      				</div>
					</div>
					<div className="content-body">
						<div className="row">
							<div className="col-md-12">
								<div className="alert alert-danger" role="alert" hidden={this.state.errors.length===0}>
									{this.state.errors.map((e, i) => <li key={i}>{e}</li>)}
								</div>
								<form className="form form-horizontal" ref="form" onSubmit={this.handleSubmit}>
									<div className="form-body">
										<div className="card pull-up">
											<div className="card-content">
												<div className="card-body">
													<h4 className="form-section">
														<i className="ft-lock"></i> Modifique su Contraseña
														<div className="float-right" style={{fontSize:'14px'}}>* campos requeridos</div>
													</h4>
													<div className="row">
														<div className="col-md-6">
															<div className="form-group row">
																<label className="col-md-4 label-control col-form-label" htmlFor="claveActual">
																	Contraseña actual{requiredSymbol}:
																</label>
																<div className="col-md-8">
																	<div>
																		<input type="password" className="form-control" id="claveActual" name="claveActual" placeholder="(Requerido)" value={formData.claveActual} onChange={this.handleFormChange} />
																		<div className="help-block text-danger" hidden={validationState.formData.claveActual.pristine || validationState.formData.claveActual.valid}>{validationState.formData.claveActual.message}</div>
																	</div>
																</div>
															</div>
															<div className="form-group row">
																<label className="col-md-4 label-control col-form-label" htmlFor="clave">
																	Contraseña nueva{requiredSymbol}:
																</label>
																<div className="col-md-8">
																	<div>
																		<input type="password" className="form-control" id="clave" name="clave" placeholder="(Requerido)" value={formData.clave} onChange={this.handleFormChange} />
																		<div className="help-block text-danger" hidden={validationState.formData.clave.pristine || validationState.formData.clave.valid}>{validationState.formData.clave.message}</div>
																	</div>
																</div>
															</div>
															<div className="form-group row">
																<label className="col-md-4 label-control col-form-label" htmlFor="claveReingresada">
																	Reingrese la contraseña{requiredSymbol}:
																</label>
																<div className="col-md-8">
																	<div>
																		<input type="password" className="form-control" id="claveReingresada" name="claveReingresada" placeholder="(Requerido)" value={formData.claveReingresada} onChange={this.handleFormChange} />
																		<div className="help-block text-danger" hidden={validationState.formData.claveReingresada.pristine || validationState.formData.claveReingresada.valid}>{validationState.formData.claveReingresada.message}</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="card pull-up">
										<div className="card-content">
											<div className="card-body">
												<div className="text-cd text-right">
													<button type="submit" className="btn btn-primary mr-1" disabled={!validationState.form.valid}>
													<i className="fa fa-check-circle"></i> Guardar
													</button>
												</div>
											</div>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default ChangePassword;