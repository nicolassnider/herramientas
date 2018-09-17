import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Config from '../../commons/config/Config.js';
import $ from 'jquery'
import 'bootstrap4-duallistbox'
import 'bootstrap4-duallistbox/dist/bootstrap-duallistbox.css'
import FormValidation from '../../commons/validation/FormValidation.js'
import Validator from '../../commons/validation/Validator.js'
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'
import Loading from '../ui/Loading.js'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
// import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'moment/min/locales'
import 'react-datepicker/dist/react-datepicker.css'
import Switch from "react-switch"
import Security from '../../commons/security/Security.js'


class BasesAbm extends Component {
	constructor(props) {
    super(props);
    this.ajaxHandler = new AjaxHandler();
    
    moment.locale('es');    		

		this.state = {
			redirectTo: null,
			props: this.props,
			formData: {
        id: 0,
        descripcion: '',
        region: null,
        subregion: null,
        tipo: null,
        activa: true,
        esOperativa: true,
        telefono: '',
        
        observaciones: '',
        direccion: '',
        numero: '',
        ceco: '',
        
        administrador: '',
        localidad: null
        
      },
      // cecos:[{ id: 0, nombre: '124567'},{ id: 1, nombre: '9863456'}], // CAMBIAR POR WS
      cecos:[],
      regiones:[],
      jefes:[],
      personasCombo:[],
      responsables:[],
      subregiones:[],  
      paises: [],
      provincias: [],
      localidades: [],         
      estados: [{ id: 0, nombre: 'Inactivo'},{ id: 1, nombre: 'Activo'}],
      tipos: [{ id: 1, nombre: 'Opertaviva'},{ id: 0, nombre: 'No Operativa'}], // CAMBIAR POR WS

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
    this.handleLocalidadChange = this.handleLocalidadChange.bind(this);
    this.handleBasesChange = this.handleBasesChange.bind(this);
    this.handlePersonaFormChange = this.handlePersonaFormChange.bind(this);
    
   
    this.formValidation = new FormValidation({
			component: this,			
			validators: {
        'formData.descripcion': (value) => Validator.notEmpty(value),
        'formData.region': (value) => Validator.notEmpty(value),  
        'formData.subregion': (value) => Validator.notEmpty(value),
        'formData.jefe': (value) => Validator.notEmpty(value),
        'formData.responsable': (value) => Validator.notEmpty(value),
        'formData.localidad': (value) => Validator.notEmpty(value)
			}
    });
    
  }
  initForm() {
    this.setState({ loading: true });
    let component = this;
    
		Promise.all([
      this.ajaxHandler.getJson('/regiones', null),
      //this.ajaxHandler.getJson('/personas', null),
      this.ajaxHandler.getJson('/personas/select'),
      this.ajaxHandler.getJson('/gerenciadores/tipo/1/select',null),
      this.ajaxHandler.getJson('/paises/select',null),
      this.ajaxHandler.getJson('/centros-costos',null),
      //this.state.props.action !== 'ADD' ? this.getData('bases', this.state.props.match.params.id) : null,
      this.state.props.action !== 'ADD' ? this.ajaxHandler.getJson('/bases/' + this.state.props.match.params.id) : null,
      this.ajaxHandler.getJson('/permisos')
      
		]).then((data) => {
      let regiones = data[0];
      let gerenciadores = data[2];
      let paises = data[3];
      let cecos = data[4]
      let formData = data[5];
      let permisosDisponibles = data[6];
      let jefes = data[1];
      let responsables = data[1];
      /*
      let jefes = data[1].map(p => ({
        id: p.id, 
        // apellido: p.apellido + ', ' + p.nombre
        nombre: p.label
      })); 
      */
      /*
      let responsables = data[1].map(p => ({
        id: p.id, 
        // apellido: p.apellido + ', ' + p.nombre
        nombre: p.label
      })); 
      */
      component.setState({
        regiones: regiones,
        jefes: jefes,
        responsables: responsables,
        gerenciadores: gerenciadores,
        paises: paises,
        cecos: cecos
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
        nonSelectedListLabel: "Bases Disponibles:",
        selectedListLabel: "Bases Asignadas:"
      });

      $(this.refs.duallistbox).change((e) => {
        let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
        formDataCopy.usuario.bases = $(this.refs.duallistbox).val();
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
    if ( service === "provincias" || service === "localidades" ) {
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

  handleRegionChange(name, object) {
    Promise.all([
      //this.getData('subregiones', object.id)    
      this.ajaxHandler.getJson('/subregiones/' + object.id + '/select')  			
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
  

  handleEstadoChange(esActivo) {
    let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy['esActivo'] = esActivo;
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

  handlePersonaFormChange(name, object) {
    const value = object === null ? null : object.value;

		let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy[name] = value;
		this.setState({
			formData: formDataCopy		
		});
  }
  handleSelectFormChange(name, object) {
    let value;
    if ( name === "localidad")
      value = object === null ? null : object.value;
    else
      value = object === null ? null : object.id;

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

  handleFormChangeSelectObject(name, object) {
    
    return new Promise((resolve, reject) => {
      let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
      formDataCopy[name] = object ? { id: object.value } : null;
      this.setState({
        formData: formDataCopy
      }, () => resolve());
    });
  }
  handleGerenciadorChange(name, gerenciador) {
   const value = gerenciador === null ? null : gerenciador.value;

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

  
	handleSubmit(event) {
    this.setState({ loading: true });
    let component = this
    this.ajaxHandler.fetch('/bases' + (this.props.action === 'ADD' ? '' : '/' + this.state.formData.id), {
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
			redirectTo: '/bases'
		});
	}

	render() {
    this.formValidation.validate();
		let formData = this.state.formData;
    let validationState = this.formValidation.state;
    let state = this.state;
    let gerenciador = formData.gerenciador ? state.gerenciadores.find(e => e.value === formData.gerenciador.id) : null;
    let jefe = formData.jefe ? state.jefes.find(e => e.value === formData.jefe.id) : null;
    let responsable = formData.responsable ? state.responsables.find(e => e.value === formData.responsable.id) : null;
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
                        {/* BASE */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="descripcion">
                              Base *:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.descripcion}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="descripcion" name="descripcion" placeholder="Base" value={formData.descripcion} onChange={this.handleInputFormChange} />   
                                <div className="help-block text-danger field-message" hidden={validationState.formData.descripcion.pristine || validationState.formData.descripcion.valid}>{validationState.formData.descripcion.message}</div>
                              </div>
                              )}															
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* REGION */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="region">
                              Región *:
                            </label>
                            <div className="col-md-9">
                            {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label">{formData.region ? formData.region.nombre : ''}</div>
                              ) : (
                                <div>
                            <Select
                                  id="region"
                                  name="region"
                                  placeholder="Región"                                                                     
                                  options={this.state.regiones}
                                  valueKey='id'
                                  labelKey='nombre'                                  
                                  value={formData.region}
                                  onChange={(e) => this.handleRegionChange("region", e)}
                                />
                                </div>
                            )}
                                <div className="help-block text-danger field-message" hidden={validationState.formData.region.pristine || validationState.formData.region.valid}>{validationState.formData.region.message}</div>														
                            </div>
                          </div>
                        </div>
                      </div>  
                      <div className="row">
                        {/* SUB REGION */}
                        <div className="col-md-6">
                          <div style={{display: formData.region === null ? 'none' : ''}} className="form-group row"> 
                            <label className="col-md-3 label-control col-form-label" htmlFor="subregion">
                              Sub Región *:
                            </label>
                            <div className="col-md-9">
                            {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label">{formData.subregion ? formData.subregion.nombre : ''}</div>
                              ) : (
                                <div>
                                <Select
                                  id="subregion"
                                  name="subregion"
                                  placeholder="Sub Región"                                                                     
                                  options={this.state.subregiones}
                                  valueKey='id'
                                  labelKey='nombre'                                  
                                  value={formData.subregion}
                                  onChange={(e) => this.handleSelectFormChange("subregion", e)}
                                />
                                </div>
                              )}
                                <div className="help-block text-danger field-message" hidden={validationState.formData.subregion.pristine || validationState.formData.subregion.valid}>{validationState.formData.subregion.message}</div>														
                            </div>
                          </div>
                        </div>
                      </div>
                      

                      <div className="row">
                       {/* GERENCIADORES */}
                       <div className="col-md-6">                  
                              <div className="form-group row">
                                <label className="col-md-3 label-control col-form-label" htmlFor="gerenciador">
                                  Gerenciador:
                                </label>
                                <div className="col-md-9">
                                  
                                
                                {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label">{formData.gerenciador ? formData.gerenciador.razon_social : ''}</div>
                              ) : (
                                

                                
                                  <div>
                                    <Select
                                      id="gerenciador"
                                      name="gerenciador"
                                      placeholder="Gerenciador"                                                                     
                                      options={this.state.gerenciadores}
                                      valueKey='value'
                                      labelKey='label'                                  
                                      value={gerenciador ? { value: gerenciador.id, label: gerenciador.label } : null}
                                      onChange={(e) => this.handleFormChangeSelectObject("gerenciador", e)}                                 
                                    />                                
                                  </div>
                              )}


    															
                                </div>
                              </div>
                            
                          </div>
                        </div>
                        <div className="row">
                       {/* CECO */}
                       <div className="col-md-6">                  
                              <div className="form-group row">
                                <label className="col-md-3 label-control col-form-label" htmlFor="centroCostos">
                                  Centro de Costo:
                                </label>
                                <div className="col-md-9">

                               

                                  <div>
                                    <Select
                                      id="centroCostos"
                                      name="centroCostos"
                                      placeholder="Centro de Costo"                                                                     
                                      options={this.state.cecos}
                                      valueKey='id'
                                      labelKey='nombre'                                  
                                      value={formData.centroCostos}
                                      onChange={(e) => this.handleSelectFormChange("centroCostos", e)}
                                      
                                    />                                
                                  </div>
                              											
                                </div>
                              </div>
                            
                          </div>
                        </div>



                        <div className="row">
                       {/* TIPOS */}
                       <div className="col-md-6">                  
                              <div className="form-group row">
                                <label className="col-md-3 label-control col-form-label" htmlFor="esOperativa">
                                  Tipo:
                                </label>
                                <div className="col-md-9">

                                  <div>
                                    <Select
                                      id="esOperativa"
                                      name="esOperativa"
                                      placeholder="Tipo"                                                                     
                                      options={this.state.tipos}
                                      valueKey='id'
                                      labelKey='nombre'                                  
                                      value={formData.esOperativa}
                                      onChange={(e) => this.handleSelectFormChange("esOperativa", e)}
                                      
                                    />                                
                                  </div>
                              														
                                </div>
                              </div>
                            
                          </div>
                        </div>  
                      <div className="row">
                        {/* ESTADO */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="activa">
                              Activa:
                            </label>
                            <div className="col-md-9">
                              <Switch
                                onChange={this.handleEstadoChange}
                                checked={formData.activa}
                                options={this.state.estados}
                                id="activa"
                                name="activa"
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
                        {/* JEFE */}
                        <div className="col-md-6">
              
                          <div  className="form-group row"> 
                            <label className="col-md-3 label-control col-form-label" htmlFor="jefe">
                              Jefe *:
                            </label>
                            <div className="col-md-9">
                            <Select
                                  id="jefe"
                                  name="jefe"
                                  placeholder="Jefe"                                                                     
                                  options={this.state.jefes}
                                  valueKey='value'
                                  labelKey='label'                                 
                                  value={jefe ? { value: jefe.id, label: jefe.label } : null}
                                  onChange={(e) => this.handleFormChangeSelectObject("jefe", e)}
                                />
                                <div className="help-block text-danger field-message" hidden={validationState.formData.jefe.pristine || validationState.formData.jefe.valid}>{validationState.formData.jefe.message}</div>														
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        {/* RESPONSABLE */}
                        <div className="col-md-6">
              
                          <div  className="form-group row"> 
                            <label className="col-md-3 label-control col-form-label" htmlFor="responsable">
                              Responsable *:
                            </label>
                            <div className="col-md-9">
                            <Select
                                  id="responsable"
                                  name="responsable"
                                  placeholder="Responsable"                                                                     
                                  options={this.state.responsables}
                                  valueKey='value'
                                  labelKey={'label'}                                  
                                  value={responsable ? { value: responsable.id, label: responsable.label } : null}
                                  onChange={(e) => this.handleFormChangeSelectObject("responsable", e)}
                                />
                                <div className="help-block text-danger field-message" hidden={validationState.formData.responsable.pristine || validationState.formData.responsable.valid}>{validationState.formData.responsable.message}</div>														
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* Administrador */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="administrador">
                              Administrador:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.administrador}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="administrador" name="administrador" placeholder="Administrador" value={formData.administrador} onChange={this.handleInputFormChange} />   
                                
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

export default BasesAbm;