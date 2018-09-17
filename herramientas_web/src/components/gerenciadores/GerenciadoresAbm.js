import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Config from '../../commons/config/Config.js';
import $ from 'jquery'
import 'bootstrap4-duallistbox'
import 'bootstrap4-duallistbox/dist/bootstrap-duallistbox.css'
import FormValidation from '../../commons/validation/FormValidation.js'
import Validator from '../../commons/validation/Validator.js'
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'
import duallistboxConfig from '../../commons/duallistbox/DuallistboxConfig.js'
import Loading from '../ui/Loading.js'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
// import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'moment/min/locales'
import 'react-datepicker/dist/react-datepicker.css'
import Switch from "react-switch"
import Security from '../../commons/security/Security.js'

class GerenciadoresAbm extends Component {
	constructor(props) {
    super(props);
    this.ajaxHandler = new AjaxHandler();
    
    moment.locale('es');    		

		this.state = {
			redirectTo: null,
			props: this.props,
			formData: {
        id: 0,
        razon_social: '',
        tipo: null,
        activo: true,
        telefono: '',
        observaciones: '',
        direccion: '',
        numero: '',
        subregiones: [],
        localidad: null
        
      },
      cecos:[{ id: 0, nombre: '124567'},{ id: 1, nombre: '9863456'}], // CAMBIAR POR WS
      regiones:[],
      jefes:[],
      personasCombo:[],
      responsables:[],
      subregiones:[],  
      paises: [],
      provincias: [],
      localidades: [],   
      subRegionesDisponibles: [],      
      estados: [{ id: 1, nombre: 'Activo'},{ id: 0, nombre: 'Inactivo'}],
      tipos: [{ id: 1, nombre: 'Taller'},{ id: 2, nombre: 'Gestor'}], // CAMBIAR POR WS

      categorias: [],    
      gerenciadores: [],
      errors: [],
      
			loading: false
    };
    
    this.handleEstadoChange = this.handleEstadoChange.bind(this);
    this.handleRegionChange = this.handleRegionChange.bind(this);
    this.handleProvinciaChange = this.handleProvinciaChange.bind(this);
    
    this.handleNotificacionesActivasChange = this.handleNotificacionesActivasChange.bind(this);
    this.handleInputFormChange = this.handleInputFormChange.bind(this);
    this.handleSelectFormChange = this.handleSelectFormChange.bind(this);
    this.handleDatePickerFormChange = this.handleDatePickerFormChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsuarioFormChange = this.handleUsuarioFormChange.bind(this);
    this.handlePerfilChange = this.handlePerfilChange.bind(this);
    this.handleMovilChange = this.handleMovilChange.bind(this);
    this.handleGerenciadorChange = this.handleGerenciadorChange.bind(this);
    this.handleBasesChange = this.handleBasesChange.bind(this);
    this.handleLocalidadChange = this.handleLocalidadChange.bind(this);
    
   
    this.formValidation = new FormValidation({
			component: this,			
			validators: {
        'formData.razon_social': (value) => Validator.notEmpty(value),
        'formData.contacto': (value) => Validator.notEmpty(value),
        'formData.localidad': (value) => Validator.notEmpty(value)
        
        
        
			}
    });
    
  }
  initForm() {
		this.setState({ loading: true });
    let component = this;
    
    
		Promise.all([
      // this.ajaxHandler.getJson('/bases/select'),
      this.ajaxHandler.getJson('/regiones', null),
      this.ajaxHandler.getJson('/gerenciadores/tipo/1/select',null),
      this.ajaxHandler.getJson('/paises/select',null),
      this.ajaxHandler.getJson('/subregiones',null),
      //this.getSubRegiones(),
      //this.state.props.action !== 'ADD' ? this.getData('gerenciadores', this.state.props.match.params.id) : null
      this.state.props.action !== 'ADD' ? this.ajaxHandler.getJson('/gerenciadores/' + this.state.props.match.params.id) : null,
      this.ajaxHandler.getJson('/permisos')
      
		]).then((data) => {
      let regiones = data[0];
      let gerenciadores = data[1];
      let paises = data[2];
      let subRegionesDisponibles = data[3];
      let formData = data[4];
      let permisosDisponibles = data[5];
      
      
      component.setState({
        regiones: regiones,
        gerenciadores: gerenciadores,
        subRegionesDisponibles: subRegionesDisponibles,
        paises: paises,
        permisosDisponibles: permisosDisponibles
			});
			if(formData) component.setState({
				formData: formData
      });

      if(this.state.props.action === 'EDIT') {
        
        
      if(formData['localidad']) this.handlePaisChange({ value: formData['localidad'].provincia.pais.id, label: formData['localidad'].provincia.pais.nombre })
        .then(() => {
          
          if(formData['localidad']) this.handleProvinciaChange({ value: formData['localidad'].provincia.id, label: formData['localidad'].provincia.nombre })
          .then(() => {
            if(formData['localidad']) this.handleLocalidadChange({ value: formData['localidad'].id, label: formData['localidad'].nombre })
          });
        });
      }
      
      
      
      $(this.refs.duallistbox).bootstrapDualListbox({
        moveOnSelect: false,
        moveAllLabel: "Mover todos",
        removeAllLabel: "Remover todos",
        moveSelectedLabel: "Mover seleccionados",
        removeSelectedLabel: "Remover seleccionados",
        infoText: false,
        filterPlaceHolder: "Filtro",
        nonSelectedListLabel: "Sub Regiones Disponibles:",
        selectedListLabel: "Sub Regiones Asignadas:"
      });

      $(this.refs.duallistbox).bootstrapDualListbox(duallistboxConfig);

			$(this.refs.duallistbox).change((e) => {
				let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
				formDataCopy.subregiones = $(this.refs.duallistbox).val();
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
  
  getData(service, param) {
    let serviceURL =""; 
    
    if ( service === "provincias" || service === "localidades"  ) {
      serviceURL = param ? (Config.get('apiUrlBase') + '/' + service + '/' + param+ '/select') : (Config.get('apiUrlBase') + '/' + service);
    } else {
      serviceURL = param ? (Config.get('apiUrlBase') + '/' + service + '/' + param) : (Config.get('apiUrlBase') + '/' + service);
    }
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

  getSubRegiones() {
		return fetch(Config.get('apiUrlBase') + '/subregiones', {
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
  handlePaisChange(object) {
    
    return new Promise((resolve, reject) => {
      if(object) {
        let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
        
        // formDataCopy.pais = { id: object.value, label: object.label };
        formDataCopy.pais = { id: object.value, label: object.label };
        formDataCopy.provincia = null;
        formDataCopy.localidad = null;
        this.setState({
          formData: formDataCopy,
          provincias: [],
          localidades: []
        }, () => {
          this.setState({ provinciasLoading: true });
          this.ajaxHandler.getJson('/provincias/' + object.value + '/select')
          .then((data) => {
            this.setState({
              provincias: data
            }, () => resolve());
          }).finally(() => {
            this.setState({ provinciasLoading: false });
          });
        });
      } else {
        let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
        formDataCopy.pais = null;
        formDataCopy.provincia = null;
        formDataCopy.localidad = null;
        this.setState({
          formData: formDataCopy,
          provincias: [],
          localidades: []
        }, () => resolve());
      }
    });
  }

  handleProvinciaChange(object) {
    return new Promise((resolve, reject) => {
      if(object) {
        let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
        formDataCopy.provincia = { id: object.value, label: object.label };
        formDataCopy.localidad = null;
        this.setState({
          formData: formDataCopy,
          localidades: []
        }, () => {
          this.setState({ localidadesLoading: true });
          this.ajaxHandler.getJson('/localidades/' + object.value + '/select')
          .then((data) => {
            this.setState({
              localidades: data
            }, () => resolve());
          }).finally(() => {
            this.setState({ localidadesLoading: false });
          });
        });
      } else {
        let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
        formDataCopy.provincia = null;
        formDataCopy.localidad = null;
        this.setState({
          formData: formDataCopy,
          localidades: []
        }, () => resolve());
      }
    });
  }

  handleLocalidadChange(object) {
    return new Promise((resolve, reject) => {
      if(object) {
        let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
        formDataCopy.localidad = { id: object.value, label: object.label };
        this.setState({
          formData: formDataCopy
        }, () => resolve());
      } else {
        let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
        formDataCopy.localidad = null;
        this.setState({
          formData: formDataCopy
        }, () => resolve());
      }
    });
  }
  

  handleRegionChange(name, object) {
    Promise.all([
      this.getData('subregiones', object.id)      			
		]).then((data) => {
      let subregiones = data[0];      	
			this.setState({
        subregiones: subregiones
      });
      this.handleSelectFormChange(name, object);			
		}).catch(function(error) {
			// TODO: Manejo de errores
			console.log(error);
    });
  }



  handleEstadoChange(activo) {
    let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy['activo'] = activo;
		this.setState({
			formData: formDataCopy
    });
  }

  handleEsUsuarioChange(esUsuario) {    
    let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy['esUsuario'] = esUsuario;
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
  
	handleBasesChange(event) {
		const target = event.target;
		const name = target.name;
		const value = target.type === 'checkbox' ? target.checked : target.value;

		let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy.usuario[name] = value;
		this.setState({
			formData: formDataCopy		
		});
  }
  

  handleUsuarioFormChange(event){
    const target = event.target;
		const name = target.name;
		const value = target.type === 'checkbox' ? target.checked : target.value;

    //TODO: CHEQUEAR QUE EL USUARIO SEA ÜNICO LO MISMO CON EL NRO. DE LEGAJO
		let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy.usuario[name] = value;
		this.setState({
			formData: formDataCopy		
		});
  }

  handleSelectFormChange(name, object) {
    
   let value = object === null ? null : object.id;
   
   if(this.state.props.action === 'EDIT') {  
      if ( name === "localidad") {
          value = object.value;
      }
          
   }

		let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy[name] = value;
		this.setState({
			formData: formDataCopy		
		});
  }

  handlePerfilChange(name, perfil) {
    const value = perfil === null ? null : perfil.id;

		let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy.usuario[name] = value;
		this.setState({
			formData: formDataCopy
		}, () => {      
      if(perfil){        
        perfil.permisos.includes('USUARIO_POSEER_MOVIL') ? this.setState({ hasPermisoMovil : true }) : this.setState({ hasPermisoMovil : false });
        perfil.permisos.includes('USUARIO_ACTUAR_COMO_GERENCIADOR') ? this.setState({ hasPermisoGerenciador : true }) : this.setState({ hasPermisoGerenciador : false });
        perfil.permisos.includes('USUARIO_TRABAJAR_BASES') ? this.setState({ hasPermisoBases : true }) : this.setState({ hasPermisoBases : false });       
      }
		});
  }

  handleMovilChange(name, movil) {
    const value = movil === null ? null : movil.id;

		let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy.usuario[name] = value;
		this.setState({
			formData: formDataCopy		
		});
  }

  handleGerenciadorChange(name, gerenciador) {
   /* const value = gerenciador === null ? null : gerenciador.id;

		let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy.usuario[name] = value;
		this.setState({
			formData: formDataCopy  
		});*/
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
			redirectTo: '/gerenciadores'
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
                        {/* Gerenciador */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="razon_social">
                              Gerenciador *:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.razon_social}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="razon_social" name="razon_social" placeholder="Gerenciador" value={formData.razon_social} onChange={this.handleInputFormChange} />   
                                <div className="help-block text-danger field-message" hidden={validationState.formData.razon_social.pristine || validationState.formData.razon_social.valid}>{validationState.formData.razon_social.message}</div>
                              </div>
                              )}															
                            </div>
                          </div>
                        </div>
                      </div>
                      
      
                        <div className="row">
                       {/* TIPOS */}
                       <div className="col-md-6">                  
                              <div className="form-group row">
                                <label className="col-md-3 label-control col-form-label" htmlFor="tipo">
                                  Tipo:
                                </label>
                                <div className="col-md-9">
                                  <div>
                                    <Select
                                      id="tipo"
                                      name="tipo"
                                      placeholder="Tipo"                                                                     
                                      options={this.state.tipos}
                                      valueKey='id'
                                      labelKey='nombre'                                  
                                      value={formData.tipo}
                                      onChange={(e) => this.handleSelectFormChange("tipo", e)}
                                      
                                    />                                
                                  </div>
                                  															
                                </div>
                              </div>
                            
                          </div>
                        </div>  

                      <div className="row">
                        {/* SUBREGIONES */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="subregiones">
                              Sub Regiones *:
                            </label>
                            <div className="col-md-9">
                           
													<div className="form-group">
														<select multiple="multiple" size="10" ref="duallistbox" value={formData.subregiones} onChange={this.handleFormChange}>
															{this.state.subRegionesDisponibles.map(function(subregion) {
															return <option key={subregion.id} value={subregion.id}>{subregion.nombre}</option>;
															})}
														</select>
													</div>
																										
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
                      <h4 className="form-section mt-2">
                        <i className="ft-phone"></i> Datos de Contacto
                      </h4>

                      <div className="row">
                        {/* Contacto */}
                        <div className="col-md-6">
              
                          <div  className="form-group row"> 
                            <label className="col-md-3 label-control col-form-label" htmlFor="contacto">
                              Contacto *:
                            </label>
                            <div className="col-md-9">
                            {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.contacto}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="contacto" name="contacto" placeholder="Contacto" value={formData.contacto} onChange={this.handleInputFormChange} />   
                                <div className="help-block text-danger field-message" hidden={validationState.formData.contacto.pristine || validationState.formData.contacto.valid}>{validationState.formData.contacto.message}</div>
                              </div>
                              )}																
                            </div>
                          </div>
                        </div>
                      </div>

                      
                     
                      <div className="row">
                        {/* TELEFONO */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="telefono">
                              Teléfono :
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.telefono}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="telefono" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={this.handleInputFormChange} />   
                                
                              </div>
                              )}															
                            </div>
                          </div>
                        </div>
                      </div>  


                      <div className="row">
                        {/* EMAIL */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="email">
                              Email* :
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.email}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="email" name="email" placeholder="Email" value={formData.email} onChange={this.handleInputFormChange} />   
                                
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
                      <h4 className="form-section mt-2">
                        <i className="ft-map-pin"></i> Datos de Ubicación
                      </h4>
                      <div className="row">
                        {/* CALLE */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="direccion">
                              Calle:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label">{formData.direccion}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="direccion" name="direccion" placeholder="Calle" value={formData.direccion} onChange={this.handleInputFormChange} />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
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
                        <div className="col-md-6">
                          <div className="row">
                            <div className="col-md-3">
                            </div>
                            {/* NRO */}
                            <div className="col-md-3">
                              <div className="form-group row">
                                <label className="col-md-5 label-control col-form-label" htmlFor="numero">
                                  Nro. :
                                </label>
                                <div className="col-md-7">
                                  {this.props.action === 'VIEW' ? (
                                    <div className="form-control-static col-form-label">{formData.numero}</div>
                                  ) : (
                                  <div>
                                    <input type="text" className="form-control" id="numero" name="numero" placeholder="Nro." value={formData.numero} onChange={this.handleInputFormChange} />
                                  </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                          </div>
                        </div>
                        {/* PROVINCIA */}
                        <div className="col-md-6">
                          <div style={{display: formData.pais ? '' : 'none'}}>
                            <div className="form-group row">
                              <label className="col-md-3 label-control col-form-label" htmlFor="provincia">
                                Provincia:
                              </label>
                              <div className="col-md-9">
                                {this.props.action === 'VIEW' ? (
                                <div className="form-control-static col-form-label">{formData.provincia ? formData.provincia.nombre : ''}</div>
                                ) : (
                                <div>
                                  <Select
                                  id="provincia"
                                  name="provincia"
                                  placeholder={formData.pais && !state.provinciasLoading ? 'Seleccione' : ''}
                                  options={this.state.provincias}
                                  valueKey='value'
                                  labelKey='label'
                                  value={provincia ? { value: provincia.id, label: provincia.label } : null}
                                  onChange={(e) => this.handleProvinciaChange(e)}
                                  disabled={!formData.pais || this.state.provinciasLoading}
                                  isLoading={state.provinciasLoading}
                                />
                                  {/*<div className="help-block text-danger field-message" hidden={validationState.formData.provincia.pristine || validationState.formData.provincia.valid}>{validationState.formData.provincia.message}</div>*/}
                                </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* OBSERVACIONES */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="observaciones">
                              Observaciones:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label">{formData.observaciones}</div>
                              ) : (
                              <div>
                                 <textarea className="form-control" id="observaciones" name="observaciones" rows="3" placeholder="Observaciones" value={formData.observaciones} onChange={this.handleInputFormChange}></textarea>
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* LOCALIDAD */}
                        <div className="col-md-6">
                          <div style={{display: formData.provincia ? '' : 'none'}}>
                          
                            <div className="form-group row">
                              <label className="col-md-3 label-control col-form-label" htmlFor="localidad">
                                Localidad:
                              </label>
                              <div className="col-md-9">
                                {this.props.action === 'VIEW' ? (
                                <div className="form-control-static col-form-label">{formData.localidad ? formData.localidad.nombre : ''}</div>
                                ) : (
                                <div>
                                  <Select
                                  id="localidad"
                                  name="localidad"
                                  placeholder={formData.provincia && !state.localidadesLoading ? 'Seleccione' : ''}
                                  options={this.state.localidades}
                                  valueKey='value'
                                  labelKey='label'
                                  value={localidad ? { value: localidad.id, label: localidad.label } : null}
                                  onChange={(e) => this.handleLocalidadChange(e)}
                                  disabled={!formData.provincia || this.state.localidadesLoading}
                                  isLoading={state.localidadesLoading}
                                />
                                  {/*<div className="help-block text-danger field-message" hidden={validationState.formData.localidad.pristine || validationState.formData.localidad.valid}>{validationState.formData.localidad.message}</div>*/}
                                </div>
                                )}
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

export default GerenciadoresAbm;