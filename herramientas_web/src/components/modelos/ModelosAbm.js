import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Config from '../../commons/config/Config.js';
// import $ from 'jquery'
import 'bootstrap4-duallistbox'
import 'bootstrap4-duallistbox/dist/bootstrap-duallistbox.css'
import FormValidation from '../../commons/validation/FormValidation.js'
import Validator from '../../commons/validation/Validator.js'
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'
// import duallistboxConfig from '../../commons/duallistbox/DuallistboxConfig.js'
import Loading from '../ui/Loading.js'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
// import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'moment/min/locales'
//import 'react-datepicker/dist/react-datepicker.css'
// import Switch from "react-switch"
import Security from '../../commons/security/Security.js'

class ModelosAbm extends Component {
	constructor(props) {
    super(props);
    this.ajaxHandler = new AjaxHandler();
    
    moment.locale('es');    		

		this.state = {
			redirectTo: null,
			props: this.props,
			formData: {
        id: 0,
        nombre: '',
        marca: null,
        tipo: null
        
        
      },
      tipos: [],
      marcas: [],
      estados: [{ id: 1, nombre: 'Activo'},{ id: 0, nombre: 'Inactivo'}],
      errors: [],
      
			loading: false
    };
    
    this.handleEstadoChange = this.handleEstadoChange.bind(this);
     
    this.handleNotificacionesActivasChange = this.handleNotificacionesActivasChange.bind(this);
    this.handleInputFormChange = this.handleInputFormChange.bind(this);
    this.handleSelectFormChange = this.handleSelectFormChange.bind(this);
    this.handleMarcahange = this.handleMarcaChange.bind(this);
    
    this.handleSubmit = this.handleSubmit.bind(this);
    
   
    this.formValidation = new FormValidation({
			component: this,			
			validators: {
        'formData.nombre': (value) => Validator.notEmpty(value),
        'formData.pais': (value) => Validator.notEmpty(value)
			}
    });
    
  }
  initForm() {
    this.setState({ loading: true });
    let component = this;
    
		Promise.all([
      this.ajaxHandler.getJson('/modelo-tipos/select', null),
      this.ajaxHandler.getJson('/marcas/select', null),
      this.state.props.action !== 'ADD' ? this.ajaxHandler.getJson('/modelos/' + this.state.props.match.params.id) : null, 
      this.ajaxHandler.getJson('/permisos') 
		]).then((data) => {
      let tipos = data[0];
      let marcas = data[1];
      let formData = data[2];
      let permisosDisponibles = data[3];
      component.setState({
        marcas: marcas,
        tipos: tipos,
        permisosDisponibles: permisosDisponibles
			});
			if(formData) component.setState({
				formData: formData
			});


    }).catch(function(error) {
			console.log(error);
			component.exit();
		}).finally(() => {
			this.setState({ loading: false });
    });
  }
	componentWillMount() {
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
  getData(service, param) {
    let serviceURL =""; 
    if ( service === "marcas" ||  service === "modelo-tipos" ) {
      serviceURL = param ? (Config.get('apiUrlBase') + '/' + service + '/' + param+ '/select') : (Config.get('apiUrlBase') + '/' + service+ '/select');
    } else {
      serviceURL = param ? (Config.get('apiUrlBase') + '/' + service + '/' + param) : (Config.get('apiUrlBase') + '/' + service);
    }
    // let serviceURL = param ? (Config.get('apiUrlBase') + '/' + service + '/' + param) : (Config.get('apiUrlBase') + '/' + service);
		return fetch(serviceURL, {
      method: 'GET', 
			headers: {
				'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization-Token': localStorage.getItem("token")
			}
		})
		.then(response => {
      return AjaxHandler.handleResponseErrorsIsValid(response) ? response.json() : null;
    });
  }

  
 

  
  handleEstadoChange(activo) {
    let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy['activo'] = activo;
		this.setState({
			formData: formDataCopy
    });
  }

  

  handleNotificacionesActivasChange(notificacionesActivas) {    
    let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy.usuario['notificacionesActivas'] = notificacionesActivas;
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
  
	
  


  handleSelectFormChange(name, object) {
    const value = object === null ? null : object.id;

		let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy[name] = value;
		this.setState({
			formData: formDataCopy		
		});
  }

  handleMarcaChange(name, object) {
    const value = object === null ? null : object.value;

    //let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
    let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
    formDataCopy[name] = { id: object.value, label: object.label };
		// formDataCopy[name] = value;
		this.setState({
			formData: formDataCopy		
		});
  }
 

  handlePaisChange(name, object) {
    Promise.all([
      this.getData('provincias', object.id)
		]).then((data) => {
      let provincias = data[0];
			this.setState({
        provincias: provincias
      });
      this.handleSelectFormChange(name, object);
		}).catch(function(error) {
			// TODO: Manejo de errores
			console.log(error);
    });
  }

	handleSubmit(event) {
    this.setState({ loading: true });
    let component = this
    this.ajaxHandler.fetch('/gerenciadores' + (this.props.action === 'ADD' ? '' : '/' + this.state.formData.id), {
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
			redirectTo: '/modelos'
		});
	}

	render() {
    let state = this.state;
    this.formValidation.validate();
		let formData = this.state.formData;
    let validationState = this.formValidation.state;
    let marca = formData.marca ? state.marcas.find(e => e.value === formData.marca.id) : null;
    let tipo = formData.tipo ? state.tipos.find(e => e.value === formData.tipo.id) : null;

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
                        <i className="icon-home"></i> Datos Generales <div className="float-right" style={{fontSize:'14px'}}>* campos requeridos</div>
                      </h4>
                      <div className="row">
                        {/* Modelo */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="nombre">
                              Modelo *:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.nombre}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="nombre" name="nombre" placeholder="Modelo" value={formData.nombre} onChange={this.handleInputFormChange} />   
                                <div className="help-block text-danger field-message" hidden={validationState.formData.nombre.pristine || validationState.formData.nombre.valid}>{validationState.formData.nombre.message}</div>
                              </div>
                              )}															
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="row">
                      {/* Tipo */}
                      <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="tipo">
                              Tipo:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label">{formData.tipo ? formData.tipo.nombre : ''}</div>
                              ) : (
                              <div>
                                <Select
                                  id="tipo"
                                  name="tipo"
                                  placeholder="Tipo"
                                  options={this.state.tipos}
                                  valueKey='value'
                                  labelKey='label'
                                  value={tipo ? { value: tipo.id, label: tipo.label } : null}
                                  onChange={(e) => this.handleMarcaChange("tipo", e)}
                                />
                                {/*<div className="help-block text-danger field-message" hidden={validationState.formData.pais.pristine || validationState.formData.pais.valid}>{validationState.formData.pais.message}</div>*/}
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="row">
                      {/* Marca */}
                      <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="marca">
                              Marca:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label">{formData.marca ? formData.marca.nombre : ''}</div>
                              ) : (
                              <div>
                                <Select
                                  id="marca"
                                  name="marca"
                                  placeholder="Marca"
                                  options={this.state.marcas}
                                  valueKey='value'
                                  labelKey='label'
                                  
                                  value={marca ? { value: marca.id, label: marca.label } : null}
                                  onChange={(e) => this.handleMarcaChange("marca", e)}
                                />
                                {/*<div className="help-block text-danger field-message" hidden={validationState.formData.pais.pristine || validationState.formData.pais.valid}>{validationState.formData.pais.message}</div>*/}
                              </div>
                              )}
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
                        <button type="submit" className="btn btn-primary mr-1" disabled={!validationState.form.valid} >
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

export default ModelosAbm;