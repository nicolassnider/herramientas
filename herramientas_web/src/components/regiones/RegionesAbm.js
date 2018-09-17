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
import Switch from "react-switch"
import Security from '../../commons/security/Security.js'

class RegionesAbm extends Component {
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
        activo: true
        
      },
      paises: [],
      estados: [{ id: 1, nombre: 'Activo'},{ id: 0, nombre: 'Inactivo'}],
      errors: [],
      
			loading: false
    };
    
    this.handleEstadoChange = this.handleEstadoChange.bind(this);
     
    this.handleNotificacionesActivasChange = this.handleNotificacionesActivasChange.bind(this);
    this.handleInputFormChange = this.handleInputFormChange.bind(this);
    this.handleSelectFormChange = this.handleSelectFormChange.bind(this);
    
    this.handleSubmit = this.handleSubmit.bind(this);
    
   
    this.formValidation = new FormValidation({
			component: this,			
			validators: {
        'formData.nombre': (value) => Validator.notEmpty(value),
        'formData.pais': (value) => Validator.notEmpty(value)
			}
    });
    
  }


  componentWillUnmount() {
		this.ajaxHandler.unsubscribe();
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
  initForm() {
		this.setState({ loading: true });
    let component = this;
    
	
    
		Promise.all([
      //this.getData('paises',null),
      this.ajaxHandler.getJson('/paises/select',null),
      //this.state.props.action !== 'ADD' ? this.getData('regiones', this.state.props.match.params.id) : null  
      this.state.props.action !== 'ADD' ? this.ajaxHandler.getJson('/regiones/' + this.state.props.match.params.id) : null,
		]).then((data) => {
      let paises = data[0];
      let formData = data[1];
      component.setState({
        paises: paises
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
  
  getData(service, param) {
    let serviceURL = param ? (Config.get('apiUrlBase') + '/' + service + '/' + param) : (Config.get('apiUrlBase') + '/' + service);
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

 

  handlePaisChange(object) {
    
    return new Promise((resolve, reject) => {
      if(object) {
        let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
        
        // formDataCopy.pais = { id: object.value, label: object.label };
        formDataCopy.pais = { id: object.value, label: object.label };
        //formDataCopy.provincia = null;
        //formDataCopy.localidad = null;
        this.setState({
          formData: formDataCopy
          //provincias: [],
         // localidades: []
        }, () => {
          // this.setState({ provinciasLoading: true });
          
        });
      } else {
        let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
        formDataCopy.pais = null;
        //formDataCopy.provincia = null;
        //formDataCopy.localidad = null;
        this.setState({
          formData: formDataCopy
         // provincias: [],
          //localidades: []
        }, () => resolve());
      }
    });
  }

	handleSubmit(event) {
    this.setState({ loading: true });
    let component = this
    this.ajaxHandler.fetch('/regiones' + (this.props.action === 'ADD' ? '' : '/' + this.state.formData.id), {
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
			redirectTo: '/regiones'
		});
	}

	render() {
    this.formValidation.validate();
		let formData = this.state.formData;
    let validationState = this.formValidation.state;

    
    let state = this.state;
    let pais = formData.pais ? state.paises.find(e => e.value === formData.pais.id) : null;
    let provincia = formData.provincia ? state.provincias.find(e => e.value === formData.provincia.id) : null;
    let localidad = formData.localidad ? state.localidades.find(e => e.value === formData.localidad.id) : null;

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
                        {/* Region */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="nombre">
                              Región *:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.nombre}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="nombre" name="nombre" placeholder="Región" value={formData.nombre} onChange={this.handleInputFormChange} />   
                                <div className="help-block text-danger field-message" hidden={validationState.formData.nombre.pristine || validationState.formData.nombre.valid}>{validationState.formData.nombre.message}</div>
                              </div>
                              )}															
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="row">
                      {/* Pais */}
                      <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="pais">
                              País:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label">{formData.pais ? formData.pais.nombre : ''}</div>
                              ) : (
                              <div>
                                <Select
                                  id="pais"
                                  name="pais"
                                  placeholder={!state.paisesLoading ? 'Seleccione' : ''}
                                  options={this.state.paises}
                                  valueKey='value'
                                  labelKey='label'
                                  value={pais ? { value: pais.id, label: pais.label } : null}
                                  onChange={(e) => this.handlePaisChange(e)}
                                  isLoading={state.paisesLoading}
                                  disabled={state.paisesLoading}
                                />
                                {/*<div className="help-block text-danger field-message" hidden={validationState.formData.pais.pristine || validationState.formData.pais.valid}>{validationState.formData.pais.message}</div>*/}
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                        




                      <div className="row">
                        {/* ESTADO */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="activo">
                              Activo:
                            </label>
                            <div className="col-md-9">
                              <Switch
                                onChange={this.handleEstadoChange}
                                checked={formData.activo}
                                options={this.state.estados}
                                id="activo"
                                name="activo"
                                valueKey='id'
                                labelKey='nombre'
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

export default RegionesAbm;