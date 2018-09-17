import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import FormValidation from '../../commons/validation/FormValidation.js'
import Validator from '../../commons/validation/Validator.js'
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'
import Loading from '../ui/Loading.js'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'moment/min/locales'
import 'react-datepicker/dist/react-datepicker.css'


class TicketDatosCierreVencimiento extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.ajaxHandler = new AjaxHandler();

		moment.locale('es');

		this.state = {
			redirectTo: null,
			props: this.props,
			formData: {
				id: this.props.ticket.id,
				numero: null,
				fechaAlta: null,
				fechaVencimiento: null
			},
			errors: [],
			loading: false
		};

		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleDatePickerFormChange = this.handleDatePickerFormChange.bind(this);
		this.handleInputFormChange = this.handleInputFormChange.bind(this);

		this.formValidation = new FormValidation({
			component: this,
			validators: {
				'formData.fechaAlta': (value) => Validator.date(value),
				'formData.fechaVencimiento': (value) => Validator.fechaVencimiento(this.state.formData.fechaAlta, value)
			}
		});
	}

	componentDidMount() {
		this.ajaxHandler.subscribe(this);
	}

	componentWillUnmount() {
		this.ajaxHandler.unsubscribe();
		this.setState({
			loading: false,
			formData: {
				id: null,
				manoDeObra: 0,
				repuestos: 0,
				adjunto: null
			}
		 }, ()=>{
			this.formValidation.validate();
			this.props.callbackSave();
		 });
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

	handleDatePickerFormChange(name, event) {
    let date = event ? event.format(): '';
    let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy[name] = date;
		this.setState({
			formData: formDataCopy
		});
  }

  handleDatePickerFormRawChange(name, date) {
    let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy[name] = date;
		this.setState({
			formData: formDataCopy
		});
	}

	handleInputFormChange(event) {
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
		this.props.callbackSave(this.state.formData);
		event.preventDefault();
	}

	handleCancel() {
		this.ajaxHandler.unsubscribe();
		this.setState({
			loading: false,
			formData: {
				id: null,
				numero: null,
				fechaAlta: null,
				fechaVencimiento: null
			}
		 }, ()=>{
			this.props.callbackClose();
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
												<i className="la la-file-text"></i> Datos del Próximo Vencimiento
												<div className="float-right" style={{fontSize:'14px'}}>* campos requeridos</div>
											</h4>
											<div className="row">
												<div className="col-md-12">
													<div className="form-group row">
														{/* NUMERO */}
														<div className="col-md-4">
														<div className="form-group row">
															<label className="col-md-6 label-control col-form-label text-nowrap" htmlFor="numero">
																Número:
															</label>
															<div className="col-md-6">
																{this.props.action === 'VIEW' ? (
																<div className="form-control-static col-form-label form-value">{formData.numero ? formData.numero : '' }</div>
																) : (
																<div>
																	<input type="text" className="form-control" id="numero" name="numero" placeholder="" value={formData.numero ? formData.numero : ''} onChange={this.handleInputFormChange} />
																</div>
																)}
															</div>
														</div>
													</div>
														{/* FECHA DE EXPEDICIÓN */}
														<div className="col-md-4">
															<div className="form-group row">
																<label className="col-md-6 label-control col-form-label" htmlFor="fechaAlta">
																	Fecha de Expedición{requiredSymbol}:
																</label>
																<div className="col-md-6">
																	<div>
																		<DatePicker
																			id="fechaAlta"
																			name="fechaAlta"
																			className="form-control date-picker-placeholder"
																			placeholderText="DD/MM/AAAA"
																			selected={formData.fechaAlta === null || formData.fechaAlta === '0000-00-00' ? null : moment(formData.fechaAlta)}
																			onChange={(event) => this.handleDatePickerFormChange("fechaAlta", event)}
																			onChangeRaw={(event) => this.handleDatePickerFormRawChange("fechaAlta", event.target.value)}
																			openToDate={moment()}
																			showMonthDropdown
																			showYearDropdown
																			dropdownMode="select"
																			autoComplete="off"
																		/>
																		<div className="help-block text-danger field-message" hidden={validationState.formData.fechaAlta.pristine || validationState.formData.fechaAlta.valid}>{validationState.formData.fechaAlta.message}</div>
																	</div>
																</div>
															</div>
														</div>
														{/* FECHA DE VENCIMIENTO */}
														{formData.fechaAlta ? (
														<div className="col-md-4">
															<div className="form-group row">
																<label className="col-md-6 label-control col-form-label" htmlFor="fechaVencimiento">
																	Fecha de Vencimiento{requiredSymbol}:
																</label>
																<div className="col-md-6">
																	<div>
																		<DatePicker
																			id="fechaVencimiento"
																			name="fechaVencimiento"
																			className="form-control date-picker-placeholder"
																			placeholderText="DD/MM/AAAA"
																			selected={formData.fechaVencimiento === null || formData.fechaVencimiento === '0000-00-00' ? null : moment(formData.fechaVencimiento)}
																			onChange={(event) => this.handleDatePickerFormChange("fechaVencimiento", event)}
																			onChangeRaw={(event) => this.handleDatePickerFormRawChange("fechaVencimiento", event.target.value)}
																			minDate={moment.max([moment(), moment(formData.fechaAlta)])}
																			openToDate={moment()}
																			showMonthDropdown
																			showYearDropdown
																			dropdownMode="select"
																			autoComplete="off"
																		/>
																		<div className="help-block text-danger field-message" hidden={validationState.formData.fechaVencimiento.pristine || validationState.formData.fechaVencimiento.valid}>{validationState.formData.fechaVencimiento.message}</div>
																	</div>
																</div>
															</div>
														</div>
														) : null}
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
											<button type="button" className="btn btn-danger" onClick={this.handleCancel}>
											<i className="fa fa-times-circle"></i> Cancelar
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

export default TicketDatosCierreVencimiento;
