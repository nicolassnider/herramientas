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


class TicketInformarFechaRealizado extends Component {
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
				fechaHoraRealizado: null
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
				'formData.fechaHoraRealizado': (value) => Validator.date(value)
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
				fechaHoraRealizado: null
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
				fechaHoraRealizado: null
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
								<div className="card">
									<div className="card-content">
										<div className="card-body">
											<h4 className="form-section">
												<i className="la la-file-text"></i> Datos del Próximo Vencimiento
												<div className="float-right" style={{fontSize:'14px'}}>* campos requeridos</div>
											</h4>
											<div className="row">
												<div className="col-md-12">
													<div className="form-group row">
														{/* FECHA REALIZADO */}
														<div className="col-md-6">
															<div className="form-group row">
																<label className="col-md-6 label-control col-form-label" htmlFor="fechaHoraRealizado">
																	Fecha Realizado{requiredSymbol}:
																</label>
																<div className="col-md-6">
																	<div>
																		<DatePicker
																			id="fechaHoraRealizado"
																			name="fechaHoraRealizado"
                                      className="form-control date-picker-placeholder"
                                      popperPlacement="right-start"
																			placeholderText="DD/MM/AAAA"
																			selected={formData.fechaHoraRealizado === null || formData.fechaHoraRealizado === '0000-00-00' ? null : moment(formData.fechaHoraRealizado)}
																			onChange={(event) => this.handleDatePickerFormChange("fechaHoraRealizado", event)}
																			onChangeRaw={(event) => this.handleDatePickerFormRawChange("fechaHoraRealizado", event.target.value)}
																			openToDate={moment()}
																			maxDate={moment()}
																			minDate={moment(this.props.ticket.fechaHoraAlta)}
																			showMonthDropdown
																			showYearDropdown
																			dropdownMode="select"
																			autoComplete="off"
																		/>
																		<div className="help-block text-danger field-message" hidden={validationState.formData.fechaHoraRealizado.pristine || validationState.formData.fechaHoraRealizado.valid}>{validationState.formData.fechaHoraRealizado.message}</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="card">
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

export default TicketInformarFechaRealizado;
