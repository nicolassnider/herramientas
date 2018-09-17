import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import $ from 'jquery'
import 'bootstrap4-duallistbox'
import 'bootstrap4-duallistbox/dist/bootstrap-duallistbox.css'
import duallistboxConfig from '../../commons/duallistbox/DuallistboxConfig.js'
import FormValidation from '../../commons/validation/FormValidation.js'
import Validator from '../../commons/validation/Validator.js'
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'
import Security from '../../commons/security/Security.js'
import Loading from '../ui/Loading.js'

class PerfilesAbm extends Component {
	constructor(props) {
		super(props);

		this.ajaxHandler = new AjaxHandler();

		this.state = {
			redirectTo: null,
			props: this.props,
			formData: {
				id: 0,
				nombre: '',
				permisos: []
			},
			permisosDisponibles: [],
			errors: [],
			loading: false
		};

		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.formValidation = new FormValidation({
			component: this,
			validators: {
				'formData.nombre': (value) => Validator.notEmpty(value)
			}
		});
	}

	componentDidMount() {
		if ((Security.hasPermission('PERFILES_CREAR') && this.state.props.action === 'ADD') ||
			(Security.hasPermission('PERFILES_MODIFICAR') && this.state.props.action === 'EDIT') ||
			(Security.hasPermission('PERFILES_VISUALIZAR') && this.state.props.action === 'VIEW')) {
			this.ajaxHandler.subscribe(this);
			this.initForm();
		} else {
			this.setState({
				redirectTo: '/error'
			});
		}
	}

	componentWillUnmount() {
		this.ajaxHandler.unsubscribe();
	}

	initForm() {
		this.setState({ loading: true });
		let component = this;
		Promise.all([
			this.ajaxHandler.getJson('/permisos'),
			this.state.props.action !== 'ADD' ? this.ajaxHandler.getJson('/perfiles/' + this.state.props.match.params.id) : null
		]).then((data) => {
			let permisosDisponibles = data[0];
			let formData = data[1];

			component.setState({
				permisosDisponibles: permisosDisponibles
			});
			if(formData) component.setState({
				formData: formData
			});

			$(this.refs.duallistbox).bootstrapDualListbox(duallistboxConfig);

			$(this.refs.duallistbox).change((e) => {
				let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
				formDataCopy.permisos = $(this.refs.duallistbox).val();
				this.setState({
					formData: formDataCopy
				});
			});
		}).catch(function(error) {
			console.log(error);
			component.exit();
		}).finally(() => {
			this.setState({ loading: false });
		});

		window.scrollTo(0, 0);
    	$('#nombre').focus();
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
		this.setState({ loading: true });
		let component = this
		this.ajaxHandler.fetch('/perfiles' + (this.props.action === 'ADD' ? '' : '/' + this.state.formData.id), {
			method: this.props.action === 'ADD' ? 'POST' : 'PUT',
			body: JSON.stringify({
				...this.state.formData
			}),
		}).then(response => {
			if(response.status !== 400) {
				if(response.status === 204) { // TODO: Se podría reemplazar por un WebSocket que actualice los permisos del usuario logueado.
					let persona = JSON.parse(localStorage.getItem("persona"));
					if(persona.usuario.perfil.id === this.state.formData.id) {
						persona.usuario.perfil.permisos = this.state.formData.permisos;
						localStorage.setItem('persona', JSON.stringify(persona));
					}
				}
				component.exit();
			} else {
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
			this.setState({ loading: false });
		});

		event.preventDefault();
	}

	handleCancel(event) {
		this.exit();
	}

	exit() {
		this.setState({
			redirectTo: '/perfiles'
		});
	}

	render() {
		this.formValidation.validate();
		let formData = this.state.formData;
		let validationState = this.formValidation.state;
		let requiredSymbol = this.state.props.action !== 'VIEW' ? ' *' : '';

		return (
			<React.Fragment>
				{this.state.redirectTo && <Redirect push to={this.state.redirectTo} />}
				{this.state.loading && <Loading />}
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
												<i className="ft-user"></i> Datos Generales
												<div className="float-right" style={{fontSize:'14px'}}>* campos requeridos</div>
											</h4>
											<div className="row">
												<div className="col-md-12">
													<div className="form-group row">
														<label className="col-md-2 label-control col-form-label" htmlFor="nombre">
															Perfil{requiredSymbol}:
														</label>
														<div className="col-md-10">
															{this.props.action === 'VIEW' ? (
															<div className="form-control-static col-form-label">{formData.nombre}</div>
															) : (
															<div>
																<input type="text" className="form-control" id="nombre" name="nombre" placeholder="Nombre del Perfil" value={formData.nombre} onChange={this.handleFormChange} />
																<div className="help-block text-danger" hidden={validationState.formData.nombre.pristine || validationState.formData.nombre.valid}>{validationState.formData.nombre.message}</div>
															</div>
															)}
														</div>
													</div>
													
													{this.props.action === 'VIEW' ? (
													<div className="form-group row">
														<label className="col-md-2 label-control col-form-label">
															Permisos Asignados:
														</label>
														<div className="form-control-static col-form-label">{formData.permisos.join(', ')}</div>
													</div>
													) : (
													<div className="form-group">
														<select multiple="multiple" size="10" ref="duallistbox" value={formData.permisos} onChange={this.handleFormChange}>
															{this.state.permisosDisponibles.map(function(permiso) {
															return <option key={permiso} value={permiso}>{permiso}</option>;
															})}
														</select>
													</div>
													)}
													
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
											{this.props.action !== 'VIEW' && (
											<button type="submit" className="btn btn-primary mr-1" disabled={!validationState.form.valid}>
											<i className="fa fa-check-circle"></i> Guardar
											</button>
											)}
											<button type="button" className="btn btn-danger" onClick={this.handleCancel.bind(this)}>
											<i className="fa fa-times-circle"></i> {this.props.action === 'VIEW' ? 'Volver' : 'Cancelar'}
											</button>
										</div>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default PerfilesAbm;