import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Security from '../../commons/security/Security.js'
import 'bootstrap4-duallistbox'
import 'bootstrap4-duallistbox/dist/bootstrap-duallistbox.css'
import FormValidation from '../../commons/validation/FormValidation.js'
import Validator from '../../commons/validation/Validator.js'
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'
import Loading from '../ui/Loading.js'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import moment from 'moment'
import 'moment/min/locales'
import 'react-datepicker/dist/react-datepicker.css'
import Switch from "react-switch"

class PreventivosAbm extends Component {
	constructor(props) {
		super(props);

    this.ajaxHandler = new AjaxHandler();

    moment.locale('es');

		this.state = {
			redirectTo: null,
			props: this.props,
			formData: {
        id: 0,
        servicio: null,
        movil: null,
        realizarALosKms: null,
        comentario: '',
        ticket: null,
        activo: true
      },
      servicios: [],
      serviciosLoading: false,
      moviles: [],
      movilesLoading: false,
      errors: [],
      loading: false
    };

    this.handleActivoChange = this.handleActivoChange.bind(this);
    this.handleInputFormChange = this.handleInputFormChange.bind(this);
    this.handleFormChangeSelectString = this.handleFormChangeSelectString.bind(this);
    this.handleFormChangeSelectObject = this.handleFormChangeSelectObject.bind(this);
    this.handleMovilChange = this.handleMovilChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.formValidation = new FormValidation({
			component: this,
			validators: {
        'formData.servicio': (value) => Validator.notEmpty(value),
        'formData.movil': (value) => Validator.conditionalNotEmpty(this.state.formData.servicio && this.state.formData.servicio.vencimientoAplicaA === 'MOVIL', value),
        'formData.realizarALosKms': (value) => Validator.intNumber(value),
			}
    });
  }

  componentDidMount() {
    if((Security.hasPermission('PREVENTIVOS_CREAR') && this.state.props.action === 'ADD') ||
       (Security.hasPermission('PREVENTIVOS_MODIFICAR') && this.state.props.action === 'EDIT') ||
       (Security.hasPermission('PREVENTIVOS_VISUALIZAR') && this.state.props.action === 'VIEW')) {
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
    let component = this;
    if(this.state.props.action === 'VIEW') this.loadFormData();

    if(this.state.props.action === 'ADD' || this.state.props.action === 'EDIT') {
      this.setState({
        serviciosLoading: true,
        movilesLoading: true,
        loading: this.state.props.action === 'EDIT'
      });

      Promise.all([
        this.ajaxHandler.getJson('/servicios/tipo-ticket/PREVENTIVO/select'),
        this.ajaxHandler.getJson('/moviles/select')
      ]).then((data) => {
        let servicios = data[0] ? data[0] : [];
        let moviles = data[1] ? data[1] : [];
        component.setState({
          serviciosLoading: false,
          movilesLoading: false,
          servicios: servicios,
          moviles: moviles
        }, () => {
          if(component.state.props.action === 'EDIT') this.loadFormData();
        });
      }).catch(function(error) {
        component.ajaxHandler.handleError(error);
      });
    }

    window.scrollTo(0, 0);
  }

  loadFormData() {
    let component = this;
    this.setState({ loading: true });
    this.ajaxHandler.getJson('/preventivos/' + this.state.props.match.params.id)
    .then(data => {
      if(data){
        component.setState({
          formData: Object.assign(this.state.formData, data)
        });
      }
    }).finally(() => {
      this.setState({ loading: false });
    });
  }

  handleFormChangeSelectString(name, object) {
    let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
    formDataCopy[name] = object === null ? '' : object.value;
    this.setState({
      formData: formDataCopy
    });
  }

  handleFormChangeSelectObject(name, object) {
    let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
    formDataCopy[name] = object ? { id: object.value } : null;
    this.setState({
      formData: formDataCopy
    });
  }

  handleMovilChange(object) {
    let component = this;
    let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
    if(object) {
      this.ajaxHandler.getJson('/moviles/' + object.value)
      .then((data) => {
        formDataCopy.movil = data;
        this.setState({
          formData: formDataCopy
        });
      }).catch(function(error) {
        component.ajaxHandler.handleError(error);
      });
    } else {
      formDataCopy.movil = null;
      this.setState({
        formData: formDataCopy
      });
    }
  }

  handleServicioChange(object) {
    let component = this;
    let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
    if(object) {
      this.ajaxHandler.getJson('/servicios/' + object.value)
      .then((data) => {
        formDataCopy.servicio = data;
        this.setState({
          formData: formDataCopy
        });
      }).catch(function(error) {
        component.ajaxHandler.handleError(error);
      });
    } else {
      formDataCopy.servicio = null;
      this.setState({
        formData: formDataCopy
      });
    }
  }

  handleActivoChange(activo) {
    let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy.activo = activo;
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

  handleForzar (){
    this.setState({
      loading: true
    }, () => {
      let component = this
      this.ajaxHandler.fetch('/preventivos/forzar/' + this.state.formData.id, {
        method: 'POST'
      }).then(response => {
        if(response.status !== 400) {
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
        this.ajaxHandler.handleError(error);
      }).finally(() => {
        this.setState({ loading: false });
      });
    });
  }

  handleNumericChange(e) {
    let name = e.target.name;
    let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
    formDataCopy[name] = (e.target.validity.valid) ? e.target.value : this.state.formData[name];
    this.setState({
      formData: formDataCopy
    });
  }

	handleSubmit(event) {
    this.setState({
      loading: true
    }, () => {
      let component = this

      this.ajaxHandler.fetch('/preventivos' + (this.props.action === 'ADD' ? '' : '/' + this.state.formData.id), {
        method: this.props.action === 'ADD' ? 'POST' : 'PUT',
        body: JSON.stringify({
          ...this.state.formData
        }),
      }).then(response => {
        if(response.status !== 400) {
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
        this.ajaxHandler.handleError(error);
      }).finally(() => {
        this.setState({ loading: false });
      });
    });
		event.preventDefault();
	}

	handleCancel(event) {
		this.exit();
	}

	exit() {
		this.setState({
			redirectTo: '/preventivos'
    });
	}

	render() {
    this.formValidation.validate();
    let state = this.state;
		let formData = state.formData;
    let validationState = this.formValidation.state;
    let requiredSymbol = state.props.action !== 'VIEW' ? ' *' : '';

    let servicio = formData.servicio ? state.servicios.find(e => e.value === formData.servicio.id) : null;
    let movil = formData.movil ? state.moviles.find(e => e.value === formData.movil.id) : null;

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
                        <i className="la la-hourglass-2"></i> Datos Generales <div className="float-right" style={{fontSize:'14px'}}>{ this.props.action === 'VIEW' ? '' : '* campos requeridos' }</div>
                      </h4>
                      <div className="row">
                        {/* MOVIL */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-4 label-control col-form-label text-nowrap" htmlFor="movil">
                              Móvil{requiredSymbol}:
                            </label>
                            <div className="col-md-8">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.movil && formData.movil.dominio ? formData.movil.dominio : ''}</div>
                              ) : (
                              <div>
                                <Select
                                  id="movil"
                                  name="movil"
                                  placeholder={!state.movilesLoading ? 'Seleccione' : ''}
                                  options={state.moviles}
                                  valueKey='value'
                                  labelKey='label'
                                  value={movil ? { value: movil.id, label: movil.label } : null}
                                  onChange={(e) => this.handleMovilChange(e)}
                                  isLoading={state.movilesLoading}
                                  disabled={state.movilesLoading}
                                />
                                <div className="help-block text-danger field-message" hidden={validationState.formData.movil.pristine || validationState.formData.movil.valid}>{validationState.formData.movil.message}</div>
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* BASE */}
                        {formData.movil ? (
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-4 label-control col-form-label">Base:</label>
                            <div className="col-md-8">
                              <div className="form-control-static col-form-label form-value">{formData.movil && formData.movil.base ? formData.movil.base.descripcion : ''}</div>
                            </div>
                          </div>
                        </div>
                        ): null}
                      </div>
                      <div className="row">
                        {/* SERVICIO */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-4 label-control col-form-label text-nowrap" htmlFor="servicio">
                              Servicio{requiredSymbol}:
                            </label>
                            <div className="col-md-8">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.servicio && formData.servicio.nombre ? formData.servicio.nombre : ''}</div>
                              ) : (
                              <div>
                                <Select
                                  id="servicio"
                                  name="servicio"
                                  placeholder={!state.serviciosLoading ? 'Seleccione' : ''}
                                  options={state.servicios}
                                  valueKey='value'
                                  labelKey='label'
                                  value={servicio ? { value: servicio.id, label: servicio.label } : null}
                                  onChange={(e) => this.handleServicioChange(e)}
                                  isLoading={state.serviciosLoading}
                                  disabled={state.serviciosLoading}
                                />
                                <div className="help-block text-danger field-message" hidden={validationState.formData.servicio.pristine || validationState.formData.servicio.valid}>{validationState.formData.servicio.message}</div>
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* KM ACTUAL */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-4 label-control col-form-label text-nowrap" htmlFor="kmActual">
                             Km. Actual:
                            </label>
                            <div className="col-md-8">
                              <div className="form-control-static col-form-label form-value">{formData.movil ? formData.movil.kmActual : '' }</div>
                            </div>
                          </div>
                        </div>
                        {/* REALIZAR A LOS KM */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-4 label-control col-form-label text-nowrap" htmlFor="realizarALosKms">
                              Realizar a los Km.{requiredSymbol}:
                            </label>
                            <div className="col-md-8">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.realizarALosKms ? formData.realizarALosKms : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" pattern="[0-9]*" id="realizarALosKms" name="realizarALosKms" placeholder="Sólo números" value={formData.realizarALosKms ? formData.realizarALosKms : ''}  onInput={this.handleNumericChange.bind(this)} />
                                <div className="help-block text-danger field-message" hidden={validationState.formData.realizarALosKms.pristine || validationState.formData.realizarALosKms.valid}>{validationState.formData.realizarALosKms.message}</div>
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* ALERTAR A LOS KM */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-4 label-control col-form-label text-nowrap" htmlFor="preventivoAlertarKmsPrevios">
                              Alertar a los Km.:
                            </label>
                            <div className="col-md-8">
                              <div className="form-control-static col-form-label form-value">{formData.servicio && formData.servicio.preventivoAlertarKmsPrevios ? formData.servicio.preventivoAlertarKmsPrevios : '' }</div>
                            </div>
                          </div>
                        </div>
                        {/* REPETIR A LOS KM */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-4 label-control col-form-label text-nowrap" htmlFor="preventivoCadaKms">
                              Repetir a los Km:
                            </label>
                            <div className="col-md-8">
                              <div className="form-control-static col-form-label form-value">{formData.servicio && formData.servicio.preventivoCadaKms ? formData.servicio.preventivoCadaKms : '' }</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* COMENTARIOS */}
                        <div className="col-md-12">
                          <div className="form-group row">
                            <label className="col-md-2 label-control col-form-label" htmlFor="comentario">
                              Comentarios:
                            </label>
                            <div className="col-md-10">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.comentario ? formData.comentario : ''}</div>
                              ) : (
                              <div>
                                <textarea className="form-control" id="comentario" name="comentario" rows="3" placeholder="" value={formData.comentario ? formData.comentario : ''} onChange={this.handleInputFormChange}></textarea>
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* ACTIVO */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-4 label-control col-form-label text-nowrap" htmlFor="activo">
                              Activo:
                            </label>
                            <div className="col-md-8 mt-auto">
                              <Switch
                                onChange={this.handleActivoChange}
                                checked={formData.activo ? formData.activo : false}
                                id="activo"
                                name="activo"
                                disabled={this.state.props.action === 'VIEW' ? true: false }
                                offColor="#FF4961"
                                onColor="#28D094"
                              />
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
                        {(this.props.action === 'VIEW' || this.props.action === 'EDIT') && !formData.ticket && Security.hasPermission('PREVENTIVOS_FORZAR')? (
                          <button type="button" className="btn btn-success mr-1" onClick={this.handleForzar.bind(this)}>
                          <i className="la la-send align-middle"></i> Forzar
                          </button>
                        ) : (
                        <div style={{display:'none'}}></div>
                        )}
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
              </div>
            </form>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default PreventivosAbm;