import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Config from '../../commons/config/Config.js'
import $ from 'jquery'
import 'bootstrap4-duallistbox'
import 'bootstrap4-duallistbox/dist/bootstrap-duallistbox.css'
import FormValidation from '../../commons/validation/FormValidation.js'
import Validator from '../../commons/validation/Validator.js'
import Security from '../../commons/security/Security.js'
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'
import ConfigBusiness from '../../commons/config/ConfigBusiness.js'
import Dialog from '../../commons/dialog/Dialog.js'
import Loading from '../ui/Loading.js'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'moment/min/locales'
import 'react-datepicker/dist/react-datepicker.css'
//import Switch from "react-switch"
import DropzoneComponent from 'react-dropzone-component/dist/react-dropzone'
import 'react-dropzone-component/styles/filepicker.css'
import 'dropzone/dist/min/dropzone.min.css'
import '../../assets/css/vec-dropzone.css'
import ChoferesGrid from './ChoferesGrid'

class MovilesAbm extends Component {
	constructor(props) {
		super(props);

    this.ajaxHandler = new AjaxHandler();

    moment.locale('es');

		this.state = {
			redirectTo: null,
			props: this.props,
			formData: {
        id: 0,
        unidad: '',
        dominio: '',
        base: null,
        activo: true,
        marca: null,
        modelo: null,
        chasis: '',
        motor: '',
        color: '',
        anio: 0,
        tipo: null,
        planPreventivo: null,
        fechaAlta: null,
        fechaBaja: null,
        responsable1: null,
        responsable2: null,
        supervisor: null,
        temporal: null,
        centroCostos: null,
        cebe: null,
        poliza: '',
        certificadoVtv: '',
        telepeaje: '',
        ypfRuta: '',
        kmActual: 0,
        nroDnrpa: '',
        activoFijo: '',
        equipo: '',
        nroTitulo: '',
        observaciones: '',
        adjuntos: [],
        estado: '',
        combustible: '',
        titular: '',
        proveedorGps: '',
        companiaOrigen: ''
      },
      bases: [],
      marcas: [],
      modelos: [],
      planesPreventivo: [],
      tiposCombustible: [{ value:'NAFTA', label:'NAFTA' },{ value:'DIESEL', label:'DIESEL' },{ value:'GNC', label:'GNC' },{ value:'ELÉCTRICO', label:'ELÉCTRICO' }],
      responsablesMovil: [],
      supervisoresMovil: [],
      centrosCostos: [],
      cebes: [],
      errors: [],
      estados: [],
      estadosActivos: [],
      estadosInactivos: [],
      loading: false,
      basesLoading: false,
      marcasLoading: false,
      modelosLoading: false,
      responsablesMovilLoading: false,
      supervisoresMovilLoading: false,
      centrosCostosLoading: false,
      cebesLoading: false,
      estadosLoading: false,
      combustiblesLoading: false,
      planesPreventivosLoading: false
    };

    this.handleInputFormChange = this.handleInputFormChange.bind(this);
    this.handleFormChangeSelectString = this.handleFormChangeSelectString.bind(this);
    this.handleFormChangeSelectObject = this.handleFormChangeSelectObject.bind(this);
    this.handleDatePickerFormChange = this.handleDatePickerFormChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setActivo = this.setActivo.bind(this);

    this.formValidation = new FormValidation({
			component: this,
			validators: {
        'formData.dominio': (value) => Validator.patente(value)
			}
    });

    this.initFileUpload();
  }

  componentDidMount() {
    if((Security.hasPermission('MOVILES_CREAR') && this.state.props.action === 'ADD') ||
       (Security.hasPermission('MOVILES_MODIFICAR') && this.state.props.action === 'EDIT') ||
       (Security.hasPermission('MOVILES_VISUALIZAR') && this.state.props.action === 'VIEW')) {
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
        basesLoading: true,
        marcasLoading: true,
        responsablesMovilLoading: true,
        supervisoresMovilLoading: true,
        centrosCostosLoading: true,
        cebesLoading: true,
        estadosLoading: true,
        combustiblesLoading: true,
        loading: this.state.props.action === 'EDIT',
        planesPreventivosLoading: true
      });

  		Promise.all([
        this.ajaxHandler.getJson('/bases/select'),
        this.ajaxHandler.getJson('/marcas/select'),
        this.ajaxHandler.getJson('/centros-costos/select'),
        this.ajaxHandler.getJson('/personas/permiso/ES_RESPONSABLE_MOVIL/select'),
        this.ajaxHandler.getJson('/personas/permiso/ES_SUPERVISOR_MOVIL/select'),
        ConfigBusiness.get('moviles.cebe.habilitado') === 'true' ? this.ajaxHandler.getJson('/cebes/select') : null,
        ConfigBusiness.get('moviles.estados'),
        ConfigBusiness.get('moviles.estadosActivos'),
        ConfigBusiness.get('moviles.estadosInactivos'),
        this.ajaxHandler.getJson('/plan-mantenimiento-preventivos/select'),
  		]).then((data) => {
        component.setState({
          basesLoading: false,
          marcasLoading: false,
          responsablesMovilLoading: false,
          supervisoresMovilLoading: false,
          centrosCostosLoading: false,
          cebesLoading: false,
          estadosLoading: false,
          combustiblesLoading: false,
          planesPreventivosLoading: false
        });

        let bases = data[0] ? data[0] : [];
        let marcas = data[1] ? data[1] :[];
        let centrosCostos = data[2] ? data[2] : [];
        let responsablesMovil = data[3] ? data[3] : [];
        let supervisoresMovil = data[4] ? data[4] : [];
        let cebes = ConfigBusiness.get('moviles.cebe.habilitado') === 'true' ? data[5] : [];
        let estados = data[6] ? data[6].split(',').map(e =>({value: e, label: e})) : [];

        let estadosActivos = data[7] ? data[7].split(',') : [];
        let estadosInactivos = data[8] ? data[8].split(',') : [];
        let planesPreventivo = data[9] ? data[9] : [];

  			component.setState({
          bases: bases,
          marcas: marcas,
          centrosCostos: centrosCostos,
          cebes: cebes,
          responsablesMovil: responsablesMovil,
          supervisoresMovil: supervisoresMovil,
          estados: estados,
          estadosActivos: estadosActivos,
          estadosInactivos: estadosInactivos,
          planesPreventivo: planesPreventivo
        }, () => {
          if(component.state.props.action === 'EDIT') this.loadFormData();
        });
      }).catch(function(error) {
  			component.ajaxHandler.handleError(error);
  		});
    }

    window.scrollTo(0, 0);
    $('#dominio').focus();
	}

  loadFormData() {
    let component = this;
    this.setState({ loading: true });
    this.ajaxHandler.getJson('/moviles/' + this.state.props.match.params.id)
    .then(data => {
      if(data) component.setState({
        formData: Object.assign(this.state.formData, data)
      }, () => {
        if(this.state.props.action === 'EDIT') {
          if(data.marca) this.handleMarcaChange({ value: data.marca.id, label: data.marca.nombre })
          .then(() => {
            if(data.modelo) this.handleModeloChange({ value: data.modelo.id, label: data.modelo.nombre })
          });
        }

        if(component.props.action !== 'ADD') {
          if(component.state.formData.adjuntos) {
            let adjuntos = component.state.formData.adjuntos;
            for(let i in adjuntos) {
              let fileUrl = '/moviles/adjunto/' + adjuntos[i].adjunto;
              let responseContentType;
              component.ajaxHandler.fetch(fileUrl, {
                method: 'GET',
                headers: {
                  'Authorization-Token': localStorage.getItem("token")
                }
              }).then(response => {
                if (response.status === 200) {
                  responseContentType = response.headers.get('Content-Type');
                  return response.blob();
                }
              }).then(imgBlob => {
                let imgUrl = URL.createObjectURL(imgBlob);
                var mockFile = {
                  adjunto: adjuntos[i].adjunto,
                  name: adjuntos[i].archivoNombre
                };
                this.adjuntosDropzone.emit("addedfile", mockFile);
                this.adjuntosDropzone.files.push(mockFile);
                this.adjuntosDropzone.emit("thumbnail", mockFile, responseContentType.includes('image') ? imgUrl : '/images/file.png');
                this.adjuntosDropzone.emit("complete", mockFile);
              }).catch(() => {
              });
            }
          }
        }
      });
    }).finally(() => {
      this.setState({ loading: false });
    });
  }

  initFileUpload() {
    let component = this;

    this.fileUploadConfig = {
      showFiletypeIcon: this.props.action === 'ADD' ? true : false,
      postUrl: Config.get('apiUrlBase') + '/moviles/adjunto'
    };

    this.fileUploadDjsConfig = {
      addRemoveLinks: false,
      thumbnailMethod: 'crop',
      dictDefaultMessage: component.state.props.action !== 'VIEW' ? "Haga click aquí o <br> arrastre sus archivos a este área." : '',
      uploadMultiple: true,
      parallelUploads: 1,
      headers: {
        "Authorization-Token": localStorage.getItem("token")
      },
      previewTemplate: `
        <div class="dz-preview dz-image-preview">
          <div class="dz-image">
            <img data-dz-thumbnail src="/images/file.png" />
          </div>
          <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress="" style="width: 0%;"></span></div>
          <div class="dz-success-mark">
            <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">      <title>Check</title>      <defs></defs>      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">        <path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF" sketch:type="MSShapeGroup"></path>      </g>    </svg>
          </div>
          <div class="dz-error-mark">
            <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">      <title>Error</title>      <defs></defs>      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">        <g id="Check-+-Oval-2" sketch:type="MSLayerGroup" stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475">          <path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" sketch:type="MSShapeGroup"></path>        </g>      </g>    </svg>
          </div>
          <div class="dz-error-message"><span data-dz-errormessage></span></div>
          <div class="dz-filename" style="width: 120px;"><span data-dz-name title="data-dz-name"></span></div>
          <div class="dz-view"><a href="" target="_blank">VER</a></div>
          ${component.state.props.action !== 'VIEW' ? '<div class="dz-remove"><a href="" data-dz-remove>ELIMINAR</a></div>' : ''}
        </div>
      `,

      init: function () {
        let dropzone = this;

        this.on('success', (file, response) => {
          file.adjunto = response.archivo;
          let formDataCopy = JSON.parse(JSON.stringify(component.state.formData));
          formDataCopy.adjuntos.push({adjunto: response.archivo});
          component.setState({
            formData: formDataCopy
          });
        });

        this.on('removedfile', (file) => {
          let formDataCopy = JSON.parse(JSON.stringify(component.state.formData));
          formDataCopy.adjuntos = formDataCopy.adjuntos.filter(a => a.adjunto !== file.adjunto);
          component.setState({
            formData: formDataCopy
          });

          component.ajaxHandler.fetch('/moviles/adjunto/' + file.adjunto, {
            method: 'DELETE'
          })
          .then(response => {
            if(response.status !== 204) {
              Dialog.alert({
                title: 'Error al eliminar el archivo.'
              });
            }
          }).catch((error) => {
            component.ajaxHandler.handleError(error);
          });
        });

        this.on('error', (file, errormessage, response) => {
          dropzone.removeFile(file);
          Dialog.alert({
            title: 'Error al cargar el archivo.'
          });
        });

        this.on('addedfile', function(file) {
          $(file.previewElement).find('.dz-view > a').on('click', (e) => {
            component.ajaxHandler.fetch('/moviles/adjunto/' + file.adjunto, {
              method: 'GET',
              headers: {
                'Authorization-Token': localStorage.getItem("token")
              }
            }).then(response => {
              if (response.status === 200) {
                return response.blob();
              }
            }).then(fileBlob => {
              let fileUrl = URL.createObjectURL(fileBlob);
              window.open(fileUrl);
            }).catch(() => {
            });

            e.preventDefault();
          });
        });

        if(component.state.props.action === 'VIEW') {
          dropzone.disable();
        }
      }
    };

    this.fileUploadHandlers = {
      init: dz => {
        this.adjuntosDropzone = dz;
      }
    };
  }

  handleMarcaChange(object) {
    return new Promise((resolve, reject) => {
      if(object) {
        let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
        formDataCopy.marca = { id: object.value, label: object.label };
        formDataCopy.modelo = null;
        this.setState({
          formData: formDataCopy,
          modelos: []
        }, () => {
          this.setState({ modelosLoading: true });
          this.ajaxHandler.getJson('/modelos/marca/' + object.value + '/select')
          .then((data) => {
            this.setState({
              modelos: data
            }, () => resolve());
          }).finally(() => {
            this.setState({ modelosLoading: false });
          });
        });
      } else {
        let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
        formDataCopy.marca = null;
        formDataCopy.modelo = null;
        this.setState({
          formData: formDataCopy,
          provincias: []
        }, () => resolve());
      }
    });
  }

  handleModeloChange(object) {
    return new Promise((resolve, reject) => {
      if(object) {
        let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
        formDataCopy.modelo = { id: object.value, label: object.label };
        this.setState({
          formData: formDataCopy
        }, () => resolve());
      } else {
        let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
        formDataCopy.modelo = null;
        this.setState({
          formData: formDataCopy
        }, () => resolve());
      }
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

  handleFormChangeSelectString(name, object) {
    return new Promise((resolve, reject) => {
      let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
      formDataCopy[name] = object === null ? '' : object.value;
      this.setState({
        formData: formDataCopy
      }, () => resolve());
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

  getResponsableBase() {
    if(this.state.formData.base) {
      this.ajaxHandler.getJson('/bases/' + this.state.formData.base.id)
      .then((data) => {
        let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
        formDataCopy.base.responsable = data.responsable;
        this.setState({
          formData: formDataCopy
        });
      });
    }
  }

  setActivo() {
    if(this.state.formData.estado ) {
      let activo = this.state.estadosActivos.findIndex(e => e === this.state.formData.estado) !== -1 ? true : false;
      let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
      formDataCopy.activo = activo;
      this.setState({
        formData: formDataCopy
      });
    }
  }

	handleSubmit(event) {
    this.setState({ loading: true });
		let component = this
		this.ajaxHandler.fetch('/moviles' + (this.props.action === 'ADD' ? '' : '/' + this.state.formData.id), {
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

		event.preventDefault();
	}

	handleCancel(event) {
		this.exit();
	}

	exit() {
		this.setState({
			redirectTo: '/moviles'
    });
	}

	render() {
    this.formValidation.validate();
		let state = this.state;
    let formData = state.formData;
    let validationState = this.formValidation.state;

    let base = formData.base ? state.bases.find(e => e.value === formData.base.id) : null;
    let marca = formData.marca ? state.marcas.find(e => e.value === formData.marca.id) : null;
    let modelo = formData.modelo ? state.modelos.find(e => e.value === formData.modelo.id) : null;
    let planPreventivo = formData.planPreventivo ? state.planesPreventivo.find(e => e.value === formData.planPreventivo.id) : null;
    let responsable1 = formData.responsable1 ? state.responsablesMovil.find(e => e.value === formData.responsable1.id) : null;
    let responsable2 = formData.responsable2 ? state.responsablesMovil.find(e => e.value === formData.responsable2.id) : null;
    let supervisor = formData.supervisor ? state.supervisoresMovil.find(e => e.value === formData.supervisor.id) : null;
    let temporal = formData.temporal ? state.supervisoresMovil.find(e => e.value === formData.temporal.id) : null;
    let centroCostos = formData.centroCostos ? state.centrosCostos.find(e => e.value === formData.centroCostos.id) : null;
    let cebe = ConfigBusiness.get('moviles.cebe.habilitado') === 'true' && formData.cebe ? state.cebes.find(e => e.value === formData.cebe.id) : null;
    let estado = formData.estado !== '' ? state.estados.find(e => e.value === formData.estado) : null;
    let combustible = formData.combustible !== '' ? state.tiposCombustible.find(e => e.value === formData.combustible) : null;

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
                        <i className="la la-info-circle"></i> Datos Generales <div className="float-right" style={{fontSize:'14px'}}>* campos requeridos</div>
                      </h4>
                      <div className="row">
                        {/* DOMINIO */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="dominio">
                              Dominio{requiredSymbol}:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.dominio ? formData.dominio : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="dominio" name="dominio" placeholder="(Requerido)" value={formData.dominio ? formData.dominio : ''} onChange={this.handleInputFormChange} />
                                <div className="help-block text-danger field-message" hidden={validationState.formData.dominio.pristine || validationState.formData.dominio.valid}>{validationState.formData.dominio.message}</div>
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* ESTADO */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="estado">
                              Estado:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{estado ? estado.label : ''}</div>
                              ) : (
                              <div>
                                <Select
                                  id="estado"
                                  name="estado"
                                  placeholder={!state.estadosLoading ? 'Seleccione' : ''}
                                  options={state.estados}
                                  valueKey='value'
                                  labelKey='label'
                                  value={estado ? { value: estado.id, label: estado.label } : null}
                                  onChange={(e) => this.handleFormChangeSelectString("estado", e).then(() => { this.setActivo() })}
                                  isLoading={state.estadosLoading}
                                  disabled={state.estadosLoading}
                                />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* UNIDAD */}
                        {/*<div className="col-md-6" style={{display: "none"}}>
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="unidad">
                              Unidad{requiredSymbol}:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.unidad ? formData.unidad : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="unidad" name="unidad" placeholder="(Requerido)" value={formData.unidad ? formData.unidad : ''} onChange={this.handleInputFormChange} />
                                {//<div className="help-block text-danger field-message" hidden={validationState.formData.unidad.pristine || validationState.formData.unidad.valid}>{validationState.formData.unidad.message}</div>
                                }
                              </div>
                              )}
                            </div>
                          </div>
                        </div>*/}
                      </div>
                      <div className="row">
                        {/* BASE */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="base">
                              Base:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.base && formData.base.descripcion ? formData.base.descripcion : ''}</div>
                              ) : (
                              <div>
                                <Select
                                  id="base"
                                  name="base"
                                  placeholder={!state.basesLoading ? 'Seleccione' : ''}
                                  options={this.state.bases}
                                  valueKey='value'
                                  labelKey='label'
                                  value={base ? { value: base.id, label: base.label } : null}
                                  onChange={(e) => this.handleFormChangeSelectObject("base", e).then(() => { this.getResponsableBase() })}
                                  isLoading={state.basesLoading}
                                  disabled={state.basesLoading}
                                />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* RESPONSABLE BASE */}
                        <div className="col-md-6">
                          <div className="form-group row" style={{display: formData.base ? '' : 'none' }}>
                            <label className="col-md-3 label-control col-form-label" htmlFor="chasis">
                              Resp. de Base :
                            </label>
                            <div className="col-md-9">
                              <div className="form-control-static col-form-label form-value">{formData.base ? (formData.base.responsable ? formData.base.responsable.nombre + ' ' + formData.base.responsable.apellido : '') : ''}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* MARCA */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label text-nowrap" htmlFor="marca">
                              Marca:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.marca && formData.marca.nombre ? formData.marca.nombre : ''}</div>
                              ) : (
                              <div>
                                <Select
                                  id="marca"
                                  name="marca"
                                  placeholder={!state.marcasLoading ? 'Seleccione' : ''}
                                  options={this.state.marcas}
                                  valueKey='value'
                                  labelKey='label'
                                  value={marca ? { value: marca.id, label: marca.label } : null}
                                  onChange={(e) => this.handleMarcaChange(e)}
                                  isLoading={state.marcasLoading}
                                  disabled={state.marcasLoading}
                                />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* MODELO */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label text-nowrap" htmlFor="modelo">
                              Modelo:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.modelo && formData.modelo.nombre ? formData.modelo.nombre : ''}</div>
                              ) : (
                              <div>
                                <Select
                                  id="modelo"
                                  name="modelo"
                                  placeholder={formData.marca && !state.modelosLoading ? 'Seleccione' : ''}
                                  options={this.state.modelos}
                                  valueKey='value'
                                  labelKey='label'
                                  value={modelo ? { value: modelo.id, label: modelo.label } : null}
                                  onChange={(e) => this.handleModeloChange(e)}
                                  disabled={!formData.marca || this.state.modelosLoading}
                                  isLoading={state.modelosLoading}
                                />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* CHASIS */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="chasis">
                              Chasis :
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.chasis ? formData.chasis : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="chasis" name="chasis" placeholder="" value={formData.chasis ? formData.chasis : ''} onChange={this.handleInputFormChange} />
                                {//<div className="help-block text-danger field-message" hidden={validationState.formData.chasis.pristine || validationState.formData.chasis.valid}>{validationState.formData.chasis.message}</div>
                                }
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* MOTOR */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="motor">
                              Motor :
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.motor ? formData.motor : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="motor" name="motor" placeholder="" value={formData.motor ? formData.motor : ''} onChange={this.handleInputFormChange} />
                                {//<div className="help-block text-danger field-message" hidden={validationState.formData.motor.pristine || validationState.formData.motor.valid}>{validationState.formData.motor.message}</div>
                                }
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* COLOR */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="color">
                              Color :
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.color ? formData.color : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="color" name="color" placeholder="" value={formData.color ? formData.color : ''} onChange={this.handleInputFormChange} />
                                {//<div className="help-block text-danger field-message" hidden={validationState.formData.color.pristine || validationState.formData.color.valid}>{validationState.formData.color.message}</div>
                                }
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* AÑO */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="anio">
                              Año :
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.anio === 0 ? null : formData.anio}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="anio" name="anio" placeholder="" value={formData.anio === 0 ? '' : formData.anio} onChange={this.handleInputFormChange} />
                                {//<div className="help-block text-danger field-message" hidden={validationState.formData.anio.pristine || validationState.formData.anio.valid}>{validationState.formData.anio.message}</div>
                                }
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* TIPO */}
                        {/*<div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="tipo">
                              Tipo :
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.tipo ? formData.tipo.nombre : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="tipo" name="tipo" placeholder="" value={formData.tipo ? formData.tipo : ''} onChange={this.handleInputFormChange} />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>*/}
                        {/* PLAN DE MANTENIMIETO PREVENTIVO */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="planPreventivo">
                              Plan Mant. Preventivo:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{planPreventivo && planPreventivo.label ? planPreventivo.label : ''}</div>
                              ) : (
                              <div>
                                <Select
                                  id="planPreventivo"
                                  name="planPreventivo"
                                  placeholder="Seleccione"
                                  options={this.state.planesPreventivo}
                                  valueKey='value'
                                  labelKey='label'
                                  value={planPreventivo ? { value: planPreventivo.id, label: planPreventivo.label } : null}
                                  onChange={(e) => this.handleFormChangeSelectObject("planPreventivo", e)}
                                  isLoading={state.planesPreventivosLoading}
                                  disable={state.planesPreventivosLoading}
                                />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* COMBUSTIBLE */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="combustible">
                              Combustible:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{combustible ? combustible.label : ''}</div>
                              ) : (
                              <div>
                                <Select
                                  id="combustible"
                                  name="combustible"
                                  placeholder={!state.combustiblesLoading ? 'Seleccione' : ''}
                                  options={state.tiposCombustible}
                                  valueKey='value'
                                  labelKey='label'
                                  value={combustible ? { value: combustible.id, label: combustible.label } : null}
                                  onChange={(e) => this.handleFormChangeSelectString("combustible", e)}
                                  isLoading={state.combustiblesLoading}
                                  disabled={state.combustiblesLoading}
                                />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* FECHA DE ALTA */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="fechaAlta">
                              Fecha de Alta:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.fechaAlta === null || formData.fechaAlta === '0000-00-00' ? '' : formData.fechaAlta}</div>
                              ) : (
                              <div>
                                <DatePicker
                                  id="fechaAlta"
                                  name="fechaAlta"
                                  className="form-control date-picker-placeholder"
                                  placeholderText="DD/MM/AAAA"
                                  selected={formData.fechaAlta === null || formData.fechaAlta === '0000-00-00' ? null : moment(formData.fechaAlta)}
                                  onChange={(event) => this.handleDatePickerFormChange("fechaAlta", event)}
                                  onChangeRaw={(event) => this.handleDatePickerFormRawChange("fechaAlta", event.target.value)}
                                  maxDate={moment()}
                                />
                                {//<div className="help-block text-danger field-message" hidden={validationState.formData.fechaAlta.pristine || validationState.formData.fechaAlta.valid}>{validationState.formData.fechaAlta.message}</div>
                                }
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* FECHA DE BAJA */}
                        <div className="col-md-6">
                          {this.props.action === 'VIEW' || this.props.action === 'EDIT' ? (
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="fechaBaja">
                              Fecha de Baja:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.fechaBaja === null || formData.fechaBaja === '0000-00-00' ? '' : formData.fechaBaja}</div>
                              ) : (
                                this.props.action === 'EDIT' ? (
                                <div>
                                  <DatePicker
                                    id="fechaBaja"
                                    name="fechaBaja"
                                    className="form-control date-picker-placeholder"
                                    placeholderText="DD/MM/AAAA"
                                    selected={formData.fechaBaja === null || formData.fechaBaja === '0000-00-00' ? null : moment(formData.fechaBaja)}
                                    onChange={(event) => this.handleDatePickerFormChange("fechaBaja", event)}
                                    onChangeRaw={(event) => this.handleDatePickerFormRawChange("fechaBaja", event.target.value)}
                                    maxDate={moment()}
                                    minDate={moment(formData.fechaIngreso)}
                                  />
                                  {//<div className="help-block text-danger field-message" hidden={validationState.formData.fechaBaja.pristine || validationState.formData.fechaBaja.valid}>{validationState.formData.fechaBaja.message}</div>
                                  }
                                </div>
                                ) : (
                                <div></div>
                                )
                              )}
                            </div>
                          </div>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card pull-up">
                  <div className="card-content">
                    <div className="card-body">
                      <h4 className="form-section mt-2">
                        <i className="ft-users"></i> Choferes
                      </h4>
                      <div className="row">
                        {/* RESPONSABLE 1 */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="responsable1">
                              Responsable 1:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.responsable1 ? formData.responsable1.nombre + ' ' + formData.responsable1.apellido : ''}</div>
                              ) : (
                              <div>
                                <Select
                                  id="responsable1"
                                  name="responsable1"
                                  placeholder={!state.responsablesMovilLoading ? 'Seleccione' : ''}
                                  options={this.state.responsablesMovil}
                                  valueKey='value'
                                  labelKey='label'
                                  value={responsable1 ? { value: responsable1.id, label: responsable1.label } : null}
                                  onChange={(e) => this.handleFormChangeSelectObject("responsable1", e)}
                                  isLoading={state.responsablesMovilLoading}
                                  disabled={state.responsablesMovilLoading}
                                />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* RESPONSABLE 2 */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="responsable2">
                              Responsable 2:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.responsable2 ? formData.responsable2.nombre + ' ' + formData.responsable2.apellido : ''}</div>
                              ) : (
                              <div>
                                <Select
                                  id="responsable2"
                                  name="responsable2"
                                  placeholder={!state.responsablesMovilLoading ? 'Seleccione' : ''}
                                  options={this.state.responsablesMovil}
                                  valueKey='value'
                                  labelKey='label'
                                  value={responsable2 ? { value: responsable2.id, label: responsable2.label } : null}
                                  onChange={(e) => this.handleFormChangeSelectObject("responsable2", e)}
                                  isLoading={state.responsablesMovilLoading}
                                  disabled={state.responsablesMovilLoading}
                                />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* SUPERVISOR */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="supervisor">
                              Supervisor:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.supervisor ? formData.supervisor.nombre + ' ' + formData.supervisor.apellido : ''}</div>
                              ) : (
                              <div>
                                <Select
                                  id="supervisor"
                                  name="supervisor"
                                  placeholder={!state.supervisoresMovilLoading ? 'Seleccione' : ''}
                                  options={this.state.supervisoresMovil}
                                  valueKey='value'
                                  labelKey='label'
                                  value={supervisor ? { value: supervisor.id, label: supervisor.label } : null}
                                  onChange={(e) => this.handleFormChangeSelectObject("supervisor", e)}
                                  isLoading={state.supervisoresMovilLoading}
                                  disabled={state.supervisoresMovilLoading}
                                />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* TEMPORAL */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="temporal">
                              Temporal:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.temporal ? formData.temporal.nombre + ' ' + formData.temporal.apellido : ''}</div>
                              ) : (
                              <div>
                                <Select
                                  id="temporal"
                                  name="temporal"
                                  placeholder={!state.supervisoresMovilLoading ? 'Seleccione' : ''}
                                  options={this.state.supervisoresMovil}
                                  valueKey='value'
                                  labelKey='label'
                                  value={temporal ? { value: temporal.id, label: temporal.label } : null}
                                  onChange={(e) => this.handleFormChangeSelectObject("temporal", e)}
                                  isLoading={state.supervisoresMovilLoading}
                                  disabled={state.supervisoresMovilLoading}
                                />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                        </div>
                        {/* BOTON HISTORICO CHOFERES */}
                        {Security.renderIfHasPermission('MOVILES_CHOFERES_HISTORICO_LISTAR', (
                        <div className="col-md-6">
                          <div className="form-group row">
                            <div className="col-md-12">
                              {this.props.action === 'VIEW' || this.props.action === 'EDIT' ? (
                              <button type="button" className="btn btn-fleet float-right" data-toggle="modal" data-target="#choferes_modal">
                              <i className="la la-search align-middle"></i> Histórico de Choferes
                              </button>
                              ) : (
                              <div style={{display:'none'}}></div>
                              )}
                            </div>
                          </div>
                        </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card pull-up">
                  <div className="card-content">
                    <div className="card-body">
                      <h4 className="form-section mt-2">
                        <i className="la la-cog"></i> Administración
                      </h4>
                      <div className="row">
                        {/* CENTRO DE COSTOS */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="centroCostos">
                              Centro de costos:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.centroCostos && formData.centroCostos.nombre ? formData.centroCostos.nombre : ''}</div>
                              ) : (
                              <div>
                                <Select
                                  id="centroCostos"
                                  name="centroCostos"
                                  placeholder={!state.centrosCostosLoading ? 'Seleccione' : ''}
                                  options={this.state.centrosCostos}
                                  valueKey='value'
                                  labelKey='label'
                                  value={centroCostos ? { value: centroCostos.id, label: centroCostos.label } : null}
                                  onChange={(e) => this.handleFormChangeSelectObject("centroCostos", e)}
                                  isLoading={state.centrosCostosLoading}
                                  disabled={state.centrosCostosLoading}
                                />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* CERTIFICADO VTV */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="certificadoVtv">
                              Certificado VTV:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.certificadoVtv ? formData.certificadoVtv : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="certificadoVtv" name="certificadoVtv" placeholder="" value={formData.certificadoVtv} onChange={this.handleInputFormChange} />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* POLIZA */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="poliza">
                              Póliza:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.poliza ? formData.poliza : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="poliza" name="poliza" placeholder="" value={formData.poliza ? formData.poliza : ''} onChange={this.handleInputFormChange} />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* YPF RUTA */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="ypfRuta">
                              YPF Ruta:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.ypfRuta ? formData.ypfRuta : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="ypfRuta" name="ypfRuta" placeholder="" value={formData.ypfRuta ? formData.ypfRuta : ''} onChange={this.handleInputFormChange} />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* TELEPEAJE */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="telepeaje">
                              Telepeaje:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.telepeaje ? formData.telepeaje : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="telepeaje" name="telepeaje" placeholder="" value={formData.telepeaje ? formData.telepeaje : ''} onChange={this.handleInputFormChange} />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* NRO. REGISTRO (DNRPA) */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="nroDnrpa">
                              Nro. Registro (DNRPA):
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.nroDnrpa ? formData.nroDnrpa : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="nroDnrpa" name="nroDnrpa" placeholder="" value={formData.nroDnrpa ? formData.nroDnrpa : ''} onChange={this.handleInputFormChange} />
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
                            <label className="col-md-3 label-control col-form-label" htmlFor="kmActual">
                              Km Actual:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.kmActual ? formData.kmActual + (formData.kmActual === 0 ? ' km' : ' kms') : 0 + ' km'}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="kmActual" name="kmActual" placeholder="" value={formData.kmActual ? formData.kmActual : 0} onChange={this.handleInputFormChange} />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* COMENTARIOS LABORALES */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="observaciones">
                              Observaciones:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.observaciones ? formData.observaciones : ''}</div>
                              ) : (
                              <div>
                                <textarea className="form-control" id="observaciones" name="observaciones" rows="3" placeholder="" value={formData.observaciones ? formData.observaciones : ''} onChange={this.handleInputFormChange}></textarea>
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* ACTIVO FIJO */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="activoFijo">
                              Activo Fijo:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.activoFijo ? formData.activoFijo : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="activoFijo" name="activoFijo" placeholder="" value={formData.activoFijo ? formData.activoFijo : ''} onChange={this.handleInputFormChange} />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* CEBE */}
                        {ConfigBusiness.get('moviles.cebe.habilitado') === 'true' ? (
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="cebe">
                              Cebe:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.cebe ? formData.cebe.nombre : ''}</div>
                              ) : (
                              <div>
                                <Select
                                  id="cebe"
                                  name="cebe"
                                  placeholder={!state.cebesLoading ? 'Seleccione' : ''}
                                  options={this.state.cebes}
                                  valueKey='value'
                                  labelKey='label'
                                  value={cebe ? { value: cebe.id, label: cebe.label } : null}
                                  onChange={(e) => this.handleFormChangeSelectObject("cebe", e)}
                                  isLoading={state.cebesLoading}
                                  disabled={state.cebesLoading}
                                />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        ) : ''}
                      </div>
                      <div className="row">
                        {/* NRO TITULO */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="nroTitulo">
                              Nro. de Título:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.nroTitulo ? formData.nroTitulo : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="nroTitulo" name="nroTitulo" placeholder="" value={formData.nroTitulo ? formData.nroTitulo : ''} onChange={this.handleInputFormChange} />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* TITULAR */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="titular">
                              Titular:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.titular ? formData.titular : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="titular" name="titular" placeholder="" value={formData.titular} onChange={this.handleInputFormChange} />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* PROVEEDOR GPS */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="proveedorGps">
                              Proveedor GPS:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.proveedorGps ? formData.proveedorGps : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="proveedorGps" name="proveedorGps" placeholder="" value={formData.proveedorGps ? formData.proveedorGps : ''} onChange={this.handleInputFormChange} />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* COMPAÑÍA ORIGEN */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="companiaOrigen">
                              Compañía Origen:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.companiaOrigen ? formData.companiaOrigen : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="companiaOrigen" name="companiaOrigen" placeholder="" value={formData.companiaOrigen} onChange={this.handleInputFormChange} />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card pull-up" hidden={this.props.action === 'VIEW' && !this.state.formData.adjuntos.length}>
                  <div className="card-content">
                    <div className="card-body">
                      <h4 className="form-section mt-2">
                        <i className="la la-folder-open"></i> Archivos Adjuntos
                      </h4>
                      <div className="row">
                        {/* ARCHIVOS ADJUNTOS */}
                        <div className="col-md-12">
                          <div className="form-group row files-upload">
                            <DropzoneComponent id="archivos" config={this.fileUploadConfig} eventHandlers={this.fileUploadHandlers} djsConfig={this.fileUploadDjsConfig} />
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
              </div>
            </form>
					</div>
				</div>

        {Security.renderIfHasPermission('MOVILES_CHOFERES_HISTORICO_LISTAR', (
        <div className="modal fade" tabIndex="-1" id="choferes_modal" role="dialog" aria-labelledby="myModalLabel">
          <div className="modal-xl modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header bg-fleet">
                <h4 className="modal-title text-white" id="myModalLabel">{'Histórico de choferes del móvil: ' + formData.dominio}</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              </div>
              <div className="modal-body modal-mh ovf-x-hidden">
                <ChoferesGrid movilId={this.state.props.match.params.id}></ChoferesGrid>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default btn-fleet" data-dismiss="modal">Ok</button>
              </div>
            </div>
          </div>
        </div>
        ))}
			</React.Fragment>
		);
	}
}

export default MovilesAbm;