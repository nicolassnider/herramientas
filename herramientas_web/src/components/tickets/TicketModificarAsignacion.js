import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import FormValidation from '../../commons/validation/FormValidation.js'
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'
import Loading from '../ui/Loading.js'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'moment/min/locales'
import 'react-datepicker/dist/react-datepicker.css'
import Switch from "react-switch"

class TicketModificarAsignacion extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.ajaxHandler = new AjaxHandler();

		moment.locale('es');

		this.state = {
			redirectTo: null,
			props: this.props,
			formData: {
				id: 0,
				gerenciador: null,
				taller: null,
				fechaHoraTurno: null,
				enTaller: false,
				observacionesTaller: null
			},
			errors: [],
			gerenciadores: [],
			talleres: [],
			loading: false,
			gerenciadoresLoading: false,
			talleresLoading: false,
			gerenciadoresDisabled: true,
			talleresDisabled: true
		};

		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleGerenciadorChange = this.handleGerenciadorChange.bind(this);
		this.handleTallerChange = this.handleTallerChange.bind(this);
		this.handleEnTallerChange = this.handleEnTallerChange.bind(this);
		this.handleDatePickerFormChange = this.handleDatePickerFormChange.bind(this);
		this.handleInputFormChange = this.handleInputFormChange.bind(this);


		this.formValidation = new FormValidation({
			component: this/*,
			validators: {
				'formData.manoDeObra': (value) => Validator.floatNunmber(value),
				'formData.repuestos': (value) => Validator.floatNunmber(value)
			}*/
		});
	}

	componentWillMount() {
		this.loadFormData();
	}

	componentDidMount() {
		this.ajaxHandler.subscribe(this);
		this.initForm();
	}

	componentWillUnmount() {
		this.ajaxHandler.unsubscribe();
		this.setState({
			loading: false,
			formData: {
				id: 0,
				gerenciador: null,
				taller: null,
				fechaHoraTurno: null,
				enTaller: false,
				observacionesTaller: null
			}
		 }, ()=>{
			this.formValidation.validate();
			this.props.callbackSave();
		 });
	}

	loadFormData() {
    this.setState({
			formData: {
				id: this.props.ticket.id,
				gerenciador: this.props.ticket.gerenciador,
				taller: this.props.ticket.taller,
				fechaHoraTurno: this.props.ticket.fechaHoraTurno,
				enTaller: this.props.ticket.enTaller,
				observacionesTaller: this.props.ticket.observacionesTaller
			},
			loading: false
		});
	}

	loadGerenciadores() {
		let base = this.props.ticket.movil ? this.props.ticket.movil.base : this.props.ticket.persona.base;
		if(base.id) {
			this.ajaxHandler.getJson('/bases/' + base.id)
			.then((data) => {
				let base = data;
				this.setState({
					gerenciadoresLoading: true,
					gerenciadoresDisabled: true
				}, () =>{
					if(base && base.subregion) {
						this.ajaxHandler.getJson('/gerenciadores/tipo/1/subregion/' + base.subregion.id + '/select')
						.then((data) => {
							let gerenciadores = data ? data : [];
							this.setState({
								gerenciadoresLoading: false,
								gerenciadoresDisabled: false,
								gerenciadores: gerenciadores,
							});
						}).catch(function(error) {
							this.ajaxHandler.handleError(error);
						})
					}
				});
			}).catch(function(error) {
				this.ajaxHandler.handleError(error);
			})
		}
	}

	loadTalleres(gerenciador) {
		let component = this;
		component.setState({
			talleresLoading: true,
			talleresDisabled: true
		}, () =>{
			component.ajaxHandler.getJson('/talleres/gerenciador/' + gerenciador.id + '/select')
			.then((data) => {
				component.setState({
					talleres: data,
					talleresLoading: false,
					talleresDisabled: false
				});
			}).catch(function(error) {
				component.ajaxHandler.handleError(error);
			})
		})
	}

	unloadTalleres() {
		let component = this;
		let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
    formDataCopy.taller = null;
		component.setState({
			talleresLoading: false,
			talleresDisabled: true,
			formData: formDataCopy,
			talleres: null
		})
	}

	initForm() {
		if(this.props.ticket.estado === 'ABIERTO') {
			this.loadGerenciadores();
			//Si tiene gerenciador
			if(this.props.ticket.gerenciador) {
				this.loadTalleres(this.props.ticket.gerenciador);
			//Si no tiene gerenciador
			} else {
				this.setState({
					talleresLoading: false,
					talleresDisabled: true
				});
			}
		//si no esta ABIERTO,
		}
	}

	handleGerenciadorChange(object) {
    if(object){
			let component = this;
      let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
      formDataCopy.gerenciador = {id: object.value, razonSocial: object.label};
      component.setState({
				formData: formDataCopy,
				talleresDisabled: true,
				talleresLoading: true
      }, () => {
				this.state.formData.gerenciador ? component.loadTalleres(this.state.formData.gerenciador) : component.unloadTalleres();
			});
		} else {
      let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
			formDataCopy.gerenciador = null;
			formDataCopy.taller = null;
      this.setState({
        formData: formDataCopy,
				talleresDisabled: true
      });
    }
	}

	handleTallerChange(object) {
    if(object){
      let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
      formDataCopy.taller = {id: object.value, razonSocial: object.label};
      this.setState({
        formData: formDataCopy
      });
    } else {
      let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
      formDataCopy.taller = null;
      this.setState({
        formData: formDataCopy
      });
    }
	}

	handleEnTallerChange (enTaller) {
    let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy.enTaller = enTaller;
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
		this.ajaxHandler.fetch( '/tickets/' + this.props.ticket.id, {
			method: 'PATCH',
			body: JSON.stringify({
				...this.state.formData
			})
		}).then(response => {
			if(response.status === 400) {
				response.json()
				.then(data => {
					this.setState({
						errors: data.detalle
					});
				});
			} else {
				this.setState({
					loading: false,
				 }, ()=>{
					this.props.callbackSave();
				 });
			}
			window.scrollTo(0,0);
		}).catch((error) => {
			this.ajaxHandler.handleError(error);
		}).finally(() => {
		});
		event.preventDefault();
	}

	handleCancel() {
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
			this.props.callbackClose();
		 });
	}

	render() {
		this.formValidation.validate();
		let formData = this.state.formData;
		let validationState = this.formValidation.state;
		//let requiredSymbol = ' *';

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
												<i className="la la-file-text"></i> Asignación
												<div className="float-right" style={{fontSize:'14px'}}>* campos requeridos</div>
											</h4>
											<div className="row">
                        {/* GERENCIADOR */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-4 label-control col-form-label" htmlFor="gerenciador">
															Gerenciador:
                            </label>
                            <div className="col-md-8">
                              {this.props.ticket.estado !== 'ABIERTO' ? (
                              <div className="form-control-static col-form-label form-value">{formData.gerenciador ? formData.gerenciador.razonSocial : ''}</div>
                              ) : (
                              <div>
                                <Select
                                  id="gerenciador"
                                  name="gerenciador"
                                  placeholder="Gerenciador"
                                  options={this.state.gerenciadores}
                                  valueKey='value'
                                  labelKey='label'
                                  value={formData.gerenciador ? {value: formData.gerenciador.id, label: formData.gerenciador.razonSocial} : null}
																	onChange={(e) => this.handleGerenciadorChange(e)}
																	isLoading={this.state.gerenciadoresLoading}
                                  disabled={this.state.gerenciadoresDisabled}
                                />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* TALLER */}
												<div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-4 label-control col-form-label" htmlFor="taller">
															Taller:
                            </label>
                            <div className="col-md-8">
                              {this.props.ticket.estado !== 'ABIERTO' ? (
                              <div className="form-control-static col-form-label form-value">{formData.taller ? formData.taller.razonSocial : ''}</div>
															) : (
                              <div>
                                <Select
                                  id="taller"
                                  name="taller"
                                  placeholder="Taller"
                                  options={this.state.talleres}
                                  valueKey='value'
                                  labelKey='label'
                                  value={formData.taller ? {value: formData.taller.id, label: formData.taller.razonSocial} : null}
																	onChange={(e) => this.handleTallerChange(e)}
																	isLoading={this.state.talleresLoading}
                                  disabled={this.state.talleresDisabled}
                                />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
											<div className="row">
                        {/* TURNO */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-4 label-control col-form-label" htmlFor="fechaHoraTurno">
                              Turno:
                            </label>
                            <div className="col-md-8">
                              {this.props.ticket.estado !== 'ABIERTO' ? (
                              <div className="form-control-static col-form-label form-value">{formData.fechaHoraTurno === null || formData.fechaHoraTurno === '0000-00-00' ? '' : formData.fechaHoraTurno}</div>
                              ) : (
                              <div>
                                <DatePicker
                                  id="fechaHoraTurno"
                                  name="fechaHoraTurno"
                                  className="form-control date-picker-placeholder"
                                  placeholderText="DD/MM/AAAA"
                                  selected={formData.fechaHoraTurno === null || formData.fechaHoraTurno === '0000-00-00' ? null : moment(formData.fechaHoraTurno)}
                                  onChange={(event) => this.handleDatePickerFormChange("fechaHoraTurno", event)}
                                  onChangeRaw={(event) => this.handleDatePickerFormRawChange("fechaHoraTurno", event.target.value)}
																	//minDate={moment()}
																	popperPlacement="right"
                                />
                                {//<div className="help-block text-danger field-message" hidden={validationState.formData.fechaHoraTurno.pristine || validationState.formData.fechaHoraTurno.valid}>{validationState.formData.fechaHoraTurno.message}</div>
                                }
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* EN TALLER */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-4 label-control col-form-label text-nowrap" htmlFor="enTaller">
															En Taller:
                            </label>
                            <div className="col-md-8">
                              <Switch
                                onChange={this.handleEnTallerChange}
                                checked={formData.enTaller ? formData.enTaller : false}
                                id="enTaller"
                                name="enTaller"
                                disabled={this.state.props.ticket.estado !== 'ABIERTO' ? true: false }
                                offColor="#FF4961"
                                onColor="#28D094"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
											<div className="row">
                        {/* OBSERVACIONES TALLER */}
                        <div className="col-md-12">
                          <div className="form-group row">
                            <label className="col-md-2 label-control col-form-label" htmlFor="observacionesTaller">
                              Observaciones:
                            </label>
                            <div className="col-md-10">
                              <div>
                                <textarea className="form-control" id="observacionesTaller" name="observacionesTaller" rows="3" placeholder="" value={formData.observacionesTaller ? formData.observacionesTaller : ''} onChange={this.handleInputFormChange}></textarea>
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
											{this.props.action !== 'VIEW' && (
											<button type="submit" className="btn btn-primary mr-1" disabled={!validationState.form.valid}>
											<i className="fa fa-check-circle"></i> Guardar
											</button>
											)}
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

export default TicketModificarAsignacion;
