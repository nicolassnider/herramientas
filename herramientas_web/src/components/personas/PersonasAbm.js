import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Config from '../../commons/config/Config.js'
import Security from '../../commons/security/Security.js'
import $ from 'jquery'
import 'bootstrap4-duallistbox'
import 'bootstrap4-duallistbox/dist/bootstrap-duallistbox.css'
import FormValidation from '../../commons/validation/FormValidation.js'
import Validator from '../../commons/validation/Validator.js'
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'
import Dialog from '../../commons/dialog/Dialog.js'
import Loading from '../ui/Loading.js'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'moment/min/locales'
import 'react-datepicker/dist/react-datepicker.css'
import Switch from "react-switch"
import DropzoneComponent from 'react-dropzone-component/dist/react-dropzone'
import 'react-dropzone-component/styles/filepicker.css'
import 'dropzone/dist/min/dropzone.min.css'
import '../../assets/css/vec-dropzone.css'

class PersonasAbm extends Component {
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
        apellido: '',
        documentoTipo: null,
        documentoNumero: 0,
        nacionalidad: null,
        sexo: '',
        fechaNacimiento: null,
        esActivo: true,
        telefonoCodArea: 0,
        telefonoNumero: 0,
        celularCodArea: 0,
        celularNumero: 0,
        email: '',
        observaciones: '',
        calle: '',
        numero: 0,
        piso: '',
        departamento: '',
        localidad: null,
        provincia: null,
        pais: null,
        legajoNumero: '',
        fechaIngreso: null,
        fechaBaja: null,
        base: null,
        categoria: null,
        contrato: '',
        ypfRuta: '',
        comentariosLaborales: '',
        esUsuario: false,
        usuario: null,
        foto: '',
        adjuntos: []
      },
      tiposDocumento: [],
      tiposDocumentoLoading: false,
      paises: [],
      paisesLoading: false,
      provincias: [],
      provinciasLoading: false,
      localidades: [],
      localidadesLoading: false,
      sexos: [{ value: 'F', label: 'Femenino'},{ value: 'M', label: 'Masculino'}],
      estados: [{ value: false, label: 'Inactivo'},{ value: true, label: 'Activo'}],
      categorias: [],
      categoriasLoading: false,
      basesDisponibles: [],
      basesDisponiblesLoading: false,
      perfiles: [],
      perfilesLoading: false,
      moviles: [],
      gerenciadores: [],
      hasPermisoMovil: false,
      hasPermisoGerenciador: false,
      hasPermisoBases: false,
      hasPermisoTrabajarTodasBases: false,
      errors: [],
      loading: false,
      basesAsignadas: []
    };

    this.handleEstadoChange = this.handleEstadoChange.bind(this);
    this.handlePaisChange = this.handlePaisChange.bind(this);
    this.handleProvinciaChange = this.handleProvinciaChange.bind(this);
    this.handleLocalidadChange = this.handleLocalidadChange.bind(this);
    this.handleEsUsuarioChange = this.handleEsUsuarioChange.bind(this);
    this.handleNotificacionesActivasChange = this.handleNotificacionesActivasChange.bind(this);
    this.handleInputFormChange = this.handleInputFormChange.bind(this);
    this.handleFormChangeSelectString = this.handleFormChangeSelectString.bind(this);
    this.handleFormChangeSelectObject = this.handleFormChangeSelectObject.bind(this);
    this.handleFormChangeUsuarioSelectObject = this.handleFormChangeUsuarioSelectObject.bind(this);
    this.handleDatePickerFormChange = this.handleDatePickerFormChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsuarioFormChange = this.handleUsuarioFormChange.bind(this);
    this.handlePerfilChange = this.handlePerfilChange.bind(this);
    this.handleGerenciadorChange = this.handleGerenciadorChange.bind(this);
    this.handleBasesChange = this.handleBasesChange.bind(this);

    this.formValidation = new FormValidation({
			component: this,
			validators: {
        'formData.nombre': (value) => Validator.notEmpty(value),
        'formData.apellido': (value) => Validator.notEmpty(value),
        'formData.documentoNumero': (value) => Validator.intNumber(value),
        'formData.documentoTipo': (value) => Validator.notEmpty(value),
        'formData.legajoNumero': (value) => Validator.notEmpty(value),
        'formData.fechaNacimiento': (value) => Validator.date(value),
        'formData.email': (value) => Validator.conditionalEmail(this.state.formData.esUsuario, value),
        'formData.fechaIngreso': (value) => Validator.dateBeforeToday(value),
        'formData.fechaBaja': (value) => Validator.dateBeforeToday(value),
        'formData.usuario.usuario': (value) => Validator.conditionalNotEmpty(this.state.formData.esUsuario, value),
        'formData.usuario.perfil': (value) => Validator.conditionalNotEmpty(this.state.formData.esUsuario, value)
        //'formData.esUsuario': (value) => { return ({valid: true, message: ''});}
        //'formData.base': (value) => Validator.notEmpty(value)
			}
    });

    this.initPhotoUpload();
    this.initFileUpload();
  }

  componentDidMount() {
    if((Security.hasPermission('PERSONAS_CREAR') && this.state.props.action === 'ADD') ||
       (Security.hasPermission('PERSONAS_MODIFICAR') && this.state.props.action === 'EDIT') ||
       (Security.hasPermission('PERSONAS_VISUALIZAR') && this.state.props.action === 'VIEW')) {
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
        tiposDocumentoLoading: true,
        paisesLoading: true,
        categoriasLoading: true,
        basesDisponiblesLoading: true,
        perfilesLoading: true,
        loading: this.state.props.action === 'EDIT'
      });

      Promise.all([
        this.ajaxHandler.getJson('/tipos-documento/select'),
        this.ajaxHandler.getJson('/paises/select'),
        this.ajaxHandler.getJson('/persona-categorias/select'),
        this.ajaxHandler.getJson('/bases/select'),
        this.ajaxHandler.getJson('/perfiles'),
        this.ajaxHandler.getJson('/moviles/select'),
        this.ajaxHandler.getJson('/gerenciadores/select')
      ]).then((data) => {
        component.setState({
          tiposDocumentoLoading: false,
          paisesLoading: false,
          categoriasLoading: false,
          basesDisponiblesLoading: false,
          perfilesLoading: false
        });
        let tiposDocumento = data[0] ? data[0] : [];
        let paises = data[1] ? data[1] : [];
        let categorias = data[2] ? data[2] : [];
        let basesDisponibles = data[3] ? data[3] : [];
        let perfiles = data[4] ? data[4] : [];
        let moviles = data[5] ? data[5] : [];
        let gerenciadores = data[6] ? data[6] : [];

        component.setState({
          tiposDocumento: tiposDocumento,
          paises: paises,
          categorias: categorias,
          basesDisponibles: basesDisponibles,
          perfiles: perfiles,
          moviles : moviles,
          gerenciadores : gerenciadores
        }, () => {
          component.state.props.action === 'EDIT' ? this.loadFormData() : this.initDualListbox();
        });


      }).catch(function(error) {
        component.ajaxHandler.handleError(error);
      });
    }

    window.scrollTo(0, 0);
    $('#nombre').focus();
  }

  initDualListbox() {
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
      this.setState({
        basesAsignadas: $(this.refs.duallistbox).val().map(e => parseInt(e, 10))
      });
    });
  }

  loadFormData() {
    let component = this;
    this.setState({ loading: true });
    this.ajaxHandler.getJson('/personas/' + this.state.props.match.params.id)
    .then(data => {
      if(data.esUsuario && data.usuario && data.usuario.perfil){
        data.usuario.perfil.permisos.includes('USUARIO_POSEER_MOVIL') ? this.setState({ hasPermisoMovil : true }) : this.setState({ hasPermisoMovil : false });
        data.usuario.perfil.permisos.includes('USUARIO_ACTUAR_COMO_GERENCIADOR') ? this.setState({ hasPermisoGerenciador : true }) : this.setState({ hasPermisoGerenciador : false });
        data.usuario.perfil.permisos.includes('USUARIO_TRABAJAR_BASES') ? this.setState({ hasPermisoBases : true }) : this.setState({ hasPermisoBases : false });
        data.usuario.perfil.permisos.includes('USUARIO_TRABAJAR_CON_TODAS_LAS_BASES') ? this.setState({ hasPermisoTrabajarTodasBases : true }) : this.setState({ hasPermisoTrabajarTodasBases : false });
      }

      if(data) component.setState({
        formData: Object.assign(this.state.formData, data)
      }, () => {
        if(this.state.props.action === 'EDIT') {
          if(data.pais) this.handlePaisChange({ value: data.pais.id, label: data.pais.nombre })
          .then(() => {
            if(data.provincia) this.handleProvinciaChange({ value: data.provincia.id, label: data.provincia.nombre })
            .then(() => {
              if(data.localidad) this.handleLocalidadChange({ value: data.localidad.id, label: data.localidad.nombre })
            });
          });
        }

        if(component.props.action !== 'ADD') {
          let basesAsignadas = [];
          basesAsignadas = this.state.formData.usuario && this.state.formData.usuario.bases ? ( component.props.action === 'EDIT' ? this.state.formData.usuario.bases.map(e => e.id) : this.state.formData.usuario.bases.map(e => e.descripcion) ) : [];
          component.setState({
            basesAsignadas: basesAsignadas
          }, () => {
           this.initDualListbox();
          });


          if(component.state.formData.foto) {
            let photoUrl = '/personas/foto/' +component.state.formData.foto;
            component.ajaxHandler.fetch(photoUrl, {
              method: 'GET',
              headers: {
                'Authorization-Token': localStorage.getItem("token")
              }
            }).then(response => {
              if (response.status === 200) {
                return response.blob();
              }
            }).then(imgBlob => {
              let imgUrl = URL.createObjectURL(imgBlob);
              // Create the mock file:
              var mockFile = { name: "Filename", size: 12345 };
              this.dropzone.emit("addedfile", mockFile);
              this.dropzone.files.push(mockFile);
              this.dropzone.emit("thumbnail", mockFile, imgUrl);
              this.dropzone.emit("complete", mockFile);
            }).catch(() => {
            });
          }

          if(component.state.formData.adjuntos) {
            let adjuntos = component.state.formData.adjuntos;
            for(let i in adjuntos) {
              let fileUrl = '/personas/adjunto/' + adjuntos[i].adjunto;
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

  initPhotoUpload() {
    let component = this;

    this.photoUploadConfig = {
      iconFiletypes: ['.jpg', '.png', '.gif'],
      showFiletypeIcon: this.props.action === 'ADD' ? true : false,
      postUrl: Config.get('apiUrlBase') + '/personas/foto'
    };

    this.photoUploadDjsConfig = {
      addRemoveLinks: false,
      acceptedFiles: "image/jpeg,image/png,image/gif",
      thumbnailMethod: 'crop',
      dictDefaultMessage: component.state.props.action !== 'VIEW' ? "Haga click aquí o <br> arrastre su foto a este área." : '',
      uploadMultiple: false,
      maxFiles: 1,
      headers: {
        "Authorization-Token": localStorage.getItem("token")
      },
      init: function () {
        let dropzone = this;
        this.on('addedfile', function(file) {
          $(this.element).find('.dz-details').hide();
        });
        if(component.state.props.action === 'ADD' || component.state.props.action === 'EDIT') {
          this.on('addedfile', function(file) {
            if (this.files.length > 1) {
              this.removeFile(this.files[0]);
            }
            file.previewElement.addEventListener("click", function() {
              dropzone.hiddenFileInput.click();
            });
            $(this.element).find('.dz-image > img').css('cursor', 'pointer');
          });
        } else {
          dropzone.disable();
        }
      }
    };

    this.photoUploadHandlers = {
      init: dz => {
        this.dropzone = dz;
      },
      success: this.handleFotoSuccess.bind(this)
    };
  }

  handleFotoSuccess(file, response) {
    let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
    formDataCopy.foto = response.foto;
    this.setState({
      formData: formDataCopy
    });
  }

  initFileUpload() {
    let component = this;

    this.fileUploadConfig = {
      showFiletypeIcon: this.props.action === 'ADD' ? true : false,
      postUrl: Config.get('apiUrlBase') + '/personas/adjunto'
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

          component.ajaxHandler.fetch('/personas/adjunto/' + file.adjunto, {
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
            component.ajaxHandler.fetch('/personas/adjunto/' + file.adjunto, {
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

  handlePaisChange(object) {
    return new Promise((resolve, reject) => {
      if(object) {
        let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
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
    formDataCopy['usuario'] = esUsuario ? ({
      id: 0,
      usuario: '',
      clave: '',
      perfil: null,
      notificacionesActivas: false,
      movil: null,
      gerenciador: null,
      bases:[]
    }) : null;
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
    const value = target.value;

		this.setState({
			basesAsignadas: value
		});
  }

  handleUsuarioFormChange(event){
    const target = event.target;
		const name = target.name;
		const value = target.type === 'checkbox' ? target.checked : target.value;

    //TODO: CHEQUEAR QUE EL USUARIO SEA UNICO LO MISMO CON EL NRO. DE LEGAJO
		let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy.usuario[name] = value;
		this.setState({
			formData: formDataCopy
		});
  }

  handlePerfilChange(name, perfil) {
    const value = perfil;

		let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy.usuario[name] = value;
		this.setState({
			formData: formDataCopy
		}, () => {
      if(perfil){
        perfil.permisos.includes('USUARIO_POSEER_MOVIL') ? this.setState({ hasPermisoMovil : true }) : this.setState({ hasPermisoMovil : false });
        perfil.permisos.includes('USUARIO_ACTUAR_COMO_GERENCIADOR') ? this.setState({ hasPermisoGerenciador : true }) : this.setState({ hasPermisoGerenciador : false });
        perfil.permisos.includes('USUARIO_TRABAJAR_BASES') ? this.setState({ hasPermisoBases : true }) : this.setState({ hasPermisoBases : false });
        perfil.permisos.includes('USUARIO_TRABAJAR_CON_TODAS_LAS_BASES') ? this.setState({ hasPermisoTrabajarTodasBases : true }) : this.setState({ hasPermisoTrabajarTodasBases : false });
      }
		});
  }

  handleFormChangeUsuarioSelectObject(name, object) {
		let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy.usuario[name] = object ? { id: object.value } : null;
		this.setState({
			formData: formDataCopy
		});
  }

  handleGerenciadorChange(name, gerenciador) {
    const value = gerenciador;

		let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy.usuario[name] = value;
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
    let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
    if(formDataCopy.usuario) formDataCopy.usuario.bases = this.state.basesAsignadas.map(e => {return{id: e}});
    this.setState({
      formData: formDataCopy,
      loading: true
    }, () => {
      let component = this
      this.ajaxHandler.fetch('/personas' + (this.props.action === 'ADD' ? '' : '/' + this.state.formData.id), {
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
			redirectTo: '/personas'
    });
	}

	render() {
    this.formValidation.validate();
    let state = this.state;
		let formData = state.formData;
    let validationState = this.formValidation.state;

    let sexo = formData.sexo !== '' ? state.sexos.find(e => e.value === formData.sexo) : null;
    let documentoTipo = formData.documentoTipo ? state.tiposDocumento.find(e => e.value === formData.documentoTipo.id) : null;
    let nacionalidad = formData.nacionalidad ? state.paises.find(e => e.value === formData.nacionalidad.id) : null;
    let categoria = formData.categoria ? state.categorias.find(e => e.value === formData.categoria.id) : null;
    let base = formData.base ? state.basesDisponibles.find(e => e.value === formData.base.id) : null;
    let movil = formData.usuario && formData.usuario.movil ? state.moviles.find(e => e.value === formData.usuario.movil.id) : null;
    let gerenciador = formData.usuario && formData.usuario.gerenciador ? state.gerenciadores.find(e => e.value === formData.usuario.gerenciador.id) : null;
    let pais = formData.pais ? state.paises.find(e => e.value === formData.pais.id) : null;
    let provincia = formData.provincia ? state.provincias.find(e => e.value === formData.provincia.id) : null;
    let localidad = formData.localidad ? state.localidades.find(e => e.value === formData.localidad.id) : null;
    let requiredSymbol = state.props.action !== 'VIEW' ? ' *' : '';

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
                        <i className="ft-user"></i> Datos Generales <div className="float-right" style={{fontSize:'14px'}}>* campos requeridos</div>
                      </h4>
                      <div className="row">
                        <div className="col-md-3">
                          <div className="form-group row photo-upload">
                            <DropzoneComponent config={this.photoUploadConfig} eventHandlers={this.photoUploadHandlers} djsConfig={this.photoUploadDjsConfig} />
                          </div>
                        </div>
                        <div className="col-md-9">
                          <div className="row">
                            {/* NOMBRE */}
                            <div className="col-md-6">
                              <div className="form-group row">
                                <label className="col-md-4 label-control col-form-label text-nowrap" htmlFor="nombre">
                                  Nombre{requiredSymbol}:
                                </label>
                                <div className="col-md-8">
                                  {this.props.action === 'VIEW' ? (
                                  <div className="form-control-static col-form-label form-value">{formData.nombre}</div>
                                  ) : (
                                  <div>
                                    <input type="text" className="form-control" id="nombre" name="nombre" placeholder="(Requerido)" value={formData.nombre ? formData.nombre : ''} onChange={this.handleInputFormChange} />
                                    <div className="help-block text-danger field-message" hidden={validationState.formData.nombre.pristine || validationState.formData.nombre.valid}>{validationState.formData.nombre.message}</div>
                                  </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* APELLIDO */}
                            <div className="col-md-6">
                              <div className="form-group row">
                                <label className="col-md-4 label-control col-form-label text-nowrap" htmlFor="apellido">
                                  Apellido{requiredSymbol}:
                                </label>
                                <div className="col-md-8">
                                  {this.props.action === 'VIEW' ? (
                                  <div className="form-control-static col-form-label form-value">{formData.apellido}</div>
                                  ) : (
                                  <div>
                                    <input type="text" className="form-control" id="apellido" name="apellido" placeholder="(Requerido)" value={formData.apellido ? formData.apellido : ''} onChange={this.handleInputFormChange} />
                                    <div className="help-block text-danger field-message" hidden={validationState.formData.apellido.pristine || validationState.formData.apellido.valid}>{validationState.formData.apellido.message}</div>
                                  </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            {/* TIPO DOCUMENTO */}
                            <div className="col-md-6">
                              <div className="form-group row">
                                <label className="col-md-4 label-control col-form-label text-nowrap" htmlFor="documentoTipo">
                                  Tipo Documento{requiredSymbol}:
                                </label>
                                <div className="col-md-8">
                                  {this.props.action === 'VIEW' ? (
                                  <div className="form-control-static col-form-label form-value">{formData.documentoTipo && formData.documentoTipo.nombre ? formData.documentoTipo.nombre : '' }</div>
                                  ) : (
                                  <div>
                                    <Select
                                      id="documentoTipo"
                                      name="documentoTipo"
                                      placeholder={!state.tiposDocumentoLoading ? 'Seleccione (Requerido)' : ''}
                                      options={state.tiposDocumento}
                                      valueKey='value'
                                      labelKey='label'
                                      value={documentoTipo ? { value: documentoTipo.id, label: documentoTipo.label } : null}
                                      onChange={(e) => this.handleFormChangeSelectObject("documentoTipo", e)}
                                      isLoading={state.tiposDocumentoLoading}
                                      disabled={state.tiposDocumentoLoading}
                                    />
                                    <div className="help-block text-danger field-message" hidden={validationState.formData.documentoTipo.pristine || validationState.formData.documentoTipo.valid}>{validationState.formData.documentoTipo.message}</div>
                                  </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* NRO DOCUMENTO */}
                            <div className="col-md-6">
                              <div className="form-group row">
                                <label className="col-md-4 label-control col-form-label text-nowrap" htmlFor="documentoNumero">
                                  Nro. Documento{requiredSymbol}:
                                </label>
                                <div className="col-md-8">
                                  {this.props.action === 'VIEW' ? (
                                  <div className="form-control-static col-form-label form-value">{formData.documentoNumero === 0 ? '': formData.documentoNumero }</div>
                                  ) : (
                                  <div>
                                    <input type="text" className="form-control" id="documentoNumero" name="documentoNumero" placeholder="Sólo números (Requerido)" value={formData.documentoNumero === 0 ? '': formData.documentoNumero} onChange={this.handleInputFormChange} />
                                    <div className="help-block text-danger field-message" hidden={validationState.formData.documentoNumero.pristine || validationState.formData.documentoNumero.valid}>{validationState.formData.documentoNumero.message}</div>
                                  </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            {/* NACIONALIDAD */}
                            <div className="col-md-6">
                              <div className="form-group row">
                                <label className="col-md-4 label-control col-form-label text-nowrap" htmlFor="nacionalidad">
                                  Nacionalidad:
                                </label>
                                <div className="col-md-8">
                                  {this.props.action === 'VIEW' ? (
                                  <div className="form-control-static col-form-label form-value">{formData.nacionalidad && formData.nacionalidad.nombre ? formData.nacionalidad.nombre : ''}</div>
                                  ) : (
                                  <div>
                                    <Select
                                      id="nacionalidad"
                                      name="nacionalidad"
                                      placeholder={!state.paisesLoading ? 'Seleccione' : ''}
                                      options={state.paises}
                                      valueKey='value'
                                      labelKey='label'
                                      value={nacionalidad ? { value: nacionalidad.id, label: nacionalidad.label } : null}
                                      onChange={(e) => this.handleFormChangeSelectObject("nacionalidad", e)}
                                      isLoading={state.paisesLoading}
                                      disabled={state.paisesLoading}
                                    />
                                  </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* SEXO */}
                            <div className="col-md-6">
                              <div className="form-group row">
                                <label className="col-md-4 label-control col-form-label text-nowrap" htmlFor="sexo">
                                  Sexo:
                                </label>
                                <div className="col-md-8">
                                  {this.props.action === 'VIEW' ? (
                                  <div className="form-control-static col-form-label form-value">{sexo ? sexo.label : ''}</div>
                                  ) : (
                                  <div>
                                    <Select
                                      id="sexo"
                                      name="sexo"
                                      placeholder="Seleccione"
                                      options={state.sexos}
                                      valueKey='value'
                                      labelKey='label'
                                      value={sexo ? { value: sexo.id, label: sexo.label } : null}
                                      onChange={(e) => this.handleFormChangeSelectString("sexo", e)}
                                    />
                                  </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            {/* FECHA DE NACIMIENTO */}
                            <div className="col-md-6">
                              <div className="form-group row">
                                <label className="col-md-4 label-control col-form-label" htmlFor="fechaNacimiento">
                                  Fecha de Nacimiento:
                                </label>
                                <div className="col-md-8">
                                  {this.props.action === 'VIEW' ? (
                                  <div className="form-control-static col-form-label form-value">{formData.fechaNacimiento === null || formData.fechaNacimiento === '0000-00-00' ? '' : formData.fechaNacimiento}</div>
                                  ) : (
                                  <div>
                                    <DatePicker
                                      id="fechaNacimiento"
                                      name="fechaNacimiento"
                                      className="form-control date-picker-placeholder"
                                      placeholderText="DD/MM/AAAA"
                                      selected={formData.fechaNacimiento === null || formData.fechaNacimiento === '0000-00-00' ? null : moment(formData.fechaNacimiento)}
                                      onChange={(event) => this.handleDatePickerFormChange("fechaNacimiento", event)}
                                      onChangeRaw={(event) => this.handleDatePickerFormRawChange("fechaNacimiento", event.target.value)}
                                      maxDate={moment()}
                                      openToDate={moment("1978-01-01")}
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                    />
                                    <div className="help-block text-danger field-message" hidden={validationState.formData.fechaNacimiento.pristine || validationState.formData.fechaNacimiento.valid}>{validationState.formData.fechaNacimiento.message}</div>
                                  </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* ES USUARIO */}
                            <div className="col-md-3">
                              <div className="form-group row">
                                <label className="col-md-6 label-control col-form-label text-nowrap" htmlFor="esUsuario">
                                  Es Usuario:
                                </label>
                                <div className="col-md-6 mt-auto">
                                  <Switch
                                    onChange={this.handleEsUsuarioChange}
                                    checked={formData.esUsuario ? formData.esUsuario : false}
                                    id="esUsuario"
                                    name="esUsuario"
                                    disabled={this.state.props.action === 'VIEW' ? true: false }
                                    offColor="#FF4961"
                                    onColor="#28D094"
                                  />
                                </div>
                              </div>
                            </div>
                            {/* ESTADO */}
                            <div className="col-md-3">
                              <div className="form-group row">
                                <label className="col-md-6 label-control col-form-label text-nowrap" htmlFor="esActivo">
                                  Activo:
                                </label>
                                <div className="col-md-6 mt-auto">
                                  <Switch
                                    onChange={this.handleEstadoChange}
                                    checked={formData.esActivo ? formData.esActivo : false}
                                    id="esActivo"
                                    name="esActivo"
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
                  </div>
                </div>
                <div className="card pull-up">
                  <div className="card-content">
                    <div className="card-body">
                      <h4 className="form-section mt-2">
                        <i className="ft-phone"></i> Datos de Contacto
                      </h4>
                      <div className="row">
                        {/* TELEFONO */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label text-nowrap" htmlFor="telefonoCodArea">
                            Teléfono:
                            </label>
                            <div className="col-md-3">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.telefonoCodArea ? formData.telefonoCodArea : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="telefonoCodArea" name="telefonoCodArea" placeholder="Cod. Area" value={formData.telefonoCodArea ? formData.telefonoCodArea : ''} onChange={this.handleInputFormChange} />
                              </div>
                              )}
                            </div>
                            <div className="col-md-6">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.telefonoNumero ? formData.telefonoNumero : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="telefonoNumero" name="telefonoNumero" placeholder="Número" value={formData.telefonoNumero ? formData.telefonoNumero : ''} onChange={this.handleInputFormChange} />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* CELULAR */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label text-nowrap" htmlFor="celularCodArea">
                            Celular:
                            </label>
                            <div className="col-md-3">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.celularCodArea ? formData.celularCodArea : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="celularCodArea" name="celularCodArea" placeholder="Cod. Area" value={formData.celularCodArea ? formData.celularCodArea: ''} onChange={this.handleInputFormChange} />
                              </div>
                              )}
                            </div>
                            <div className="col-md-6">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.celularNumero ? formData.celularNumero : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="celularNumero" name="celularNumero" placeholder="Número" value={formData.celularNumero ? formData.celularNumero : ''} onChange={this.handleInputFormChange} />
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
                            <label className="col-md-3 label-control col-form-label text-nowrap" htmlFor="email">
                              Email{formData.esUsuario ? requiredSymbol : ''}:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.email}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="email" name="email" placeholder={formData.esUsuario ? '(Requerido)' : ''} value={formData.email ? formData.email : ''} onChange={this.handleInputFormChange} />
                                <div className="help-block text-danger field-message" hidden={validationState.formData.email.pristine || validationState.formData.email.valid}>{validationState.formData.email.message}</div>
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
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label text-nowrap" htmlFor="calle">
                              Dirección:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.calle}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="calle" name="calle" placeholder="Calle" value={formData.calle ? formData.calle : ''} onChange={this.handleInputFormChange} />
                              </div>
                              )}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-3">
                            </div>
                            {/* DIRECCION NUMERO */}
                            <div className="col-md-3">
                              <div className="form-group row">
                                <div className="col-md-12">
                                  {this.props.action === 'VIEW' ? (
                                    <div className="form-control-static col-form-label form-value">{formData.numero ? formData.numero : ''}</div>
                                  ) : (
                                  <div>
                                    <input type="text" className="form-control" id="numero" name="numero" placeholder="Número" value={formData.numero ? formData.numero : ''} onChange={this.handleInputFormChange} />
                                  </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* DIRECCION PISO */}
                            <div className="col-md-3">
                              <div className="form-group row">
                                <div className="col-md-12">
                                  {this.props.action === 'VIEW' ? (
                                    <div className="form-control-static col-form-label form-value">{formData.piso}</div>
                                  ) : (
                                  <div>
                                    <input type="text" className="form-control" id="piso" name="piso" placeholder="Piso" value={formData.piso ? formData.piso: ''} onChange={this.handleInputFormChange} />
                                  </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* DIRECCION DEPARTAMENTO */}
                            <div className="col-md-3">
                              <div className="form-group row">
                                <div className="col-md-12">
                                  {this.props.action === 'VIEW' ? (
                                    <div className="form-control-static col-form-label form-value">{formData.departamento}</div>
                                  ) : (
                                  <div>
                                    <input type="text" className="form-control" id="departamento" name="departamento" placeholder="Departamento" value={formData.departamento ? formData.departamento : ''} onChange={this.handleInputFormChange} />
                                  </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* OBSERVACIONES */}
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label text-nowrap" htmlFor="observaciones">
                              Observaciones:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.observaciones}</div>
                              ) : (
                              <div>
                                 <textarea className="form-control" id="observaciones" name="observaciones" rows="3" placeholder="" value={formData.observaciones ? formData.observaciones : ''} onChange={this.handleInputFormChange}></textarea>
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          {/* Pais */}
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label text-nowrap" htmlFor="pais">
                              País:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.pais ? formData.pais.nombre : ''}</div>
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
                              </div>
                              )}
                            </div>
                          </div>
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label text-nowrap" htmlFor="provincia">
                              Provincia:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.provincia && formData.provincia.nombre ? formData.provincia.nombre : ''}</div>
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
                              </div>
                              )}
                            </div>
                          </div>
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label text-nowrap" htmlFor="localidad">
                              Localidad:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.localidad && formData.localidad.nombre ? formData.localidad.nombre : ''}</div>
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
                        <i className="ft-briefcase"></i> Datos Laborales
                      </h4>
                      <div className="row">
                        {/* LEGAJO */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label text-nowrap" htmlFor="legajoNumero">
                              Nro. Legajo{requiredSymbol}:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.legajoNumero ? formData.legajoNumero : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="legajoNumero" name="legajoNumero" placeholder="(Requerido)" value={formData.legajoNumero} onChange={this.handleInputFormChange} />
                                <div className="help-block text-danger field-message" hidden={validationState.formData.legajoNumero.pristine || validationState.formData.legajoNumero.valid}>{validationState.formData.legajoNumero.message}</div>
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* CATEGORÍA */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label text-nowrap" htmlFor="categoria">
                              Categoría:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.categoria && formData.categoria.nombre ? formData.categoria.nombre : ''}</div>
                              ) : (
                              <div>
                                <Select
                                  id="categoria"
                                  name="categoria"
                                  placeholder={!state.categoriasLoading ? 'Seleccione' : ''}
                                  options={state.categorias}
                                  valueKey='value'
                                  labelKey='label'
                                  value={categoria ? { value: categoria.id, label: categoria.label } : null}
                                  onChange={(e) => this.handleFormChangeSelectObject("categoria", e)}
                                  isLoading={state.categoriasLoading}
                                  disabled={state.categoriasLoading}
                                />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* FECHA DE INGRESO */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label text-nowrap" htmlFor="fechaIngreso">
                              Fecha de Ingreso:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.fechaIngreso === null || formData.fechaIngreso === '0000-00-00' ? '' : formData.fechaIngreso}</div>
                              ) : (
                              <div>
                                <DatePicker
                                  id="fechaIngreso"
                                  name="fechaIngreso"
                                  className="form-control date-picker-placeholder"
                                  placeholderText="DD/MM/AAAA"
                                  selected={formData.fechaIngreso === null || formData.fechaIngreso === '0000-00-00' ? null : moment(formData.fechaIngreso)}
                                  onChange={(event) => this.handleDatePickerFormChange("fechaIngreso", event)}
                                  onChangeRaw={(event) => this.handleDatePickerFormRawChange("fechaIngreso", event.target.value)}
                                  maxDate={moment()}
                                />
                                <div className="help-block text-danger field-message" hidden={validationState.formData.fechaIngreso.pristine || validationState.formData.fechaIngreso.valid}>{validationState.formData.fechaIngreso.message}</div>
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* FECHA DE BAJA */}
                        <div className="col-md-6">
                          {this.props.action === 'VIEW' || this.props.action === 'EDIT' ? (
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label text-nowrap" htmlFor="fechaBaja">
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
                                  <div className="help-block text-danger field-message" hidden={validationState.formData.fechaBaja.pristine || validationState.formData.fechaBaja.valid}>{validationState.formData.fechaBaja.message}</div>
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
                      <div className="row">
                        {/* BASE */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label text-nowrap" htmlFor="base">
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
                                  placeholder={!state.basesDisponiblesLoading ? 'Seleccione' : ''}
                                  options={this.state.basesDisponibles}
                                  valueKey='value'
                                  labelKey='label'
                                  value={base ? { value: base.id, label: base.label } : null}
                                  onChange={(e) => this.handleFormChangeSelectObject("base", e)}
                                  isLoading={state.basesDisponiblesLoading}
                                  disabled={state.basesDisponiblesLoading}
                                />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* CONTRATO */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label text-nowrap" htmlFor="contrato">
                              Contrato:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.contrato ? formData.contrato : ''}</div>
                              ) : (
                              <div>
                                <input type="text" className="form-control" id="contrato" name="contrato" placeholder="" value={formData.contrato ? formData.contrato : ''} onChange={this.handleInputFormChange} />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* YPF RUTA */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label text-nowrap" htmlFor="ypfRuta">
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
                        {/* COMENTARIOS LABORALES */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="comentariosLaborales">
                              Comentarios Laborales:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.comentariosLaborales ? formData.comentariosLaborales : ''}</div>
                              ) : (
                              <div>
                                <textarea className="form-control" id="comentariosLaborales" name="comentariosLaborales" rows="3" placeholder="" value={formData.comentariosLaborales ? formData.comentariosLaborales : ''} onChange={this.handleInputFormChange}></textarea>
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card pull-up" style={{display: formData.esUsuario ? '' : 'none' }}>
                  <div className="card-content">
                    <div className="card-body">
                      <h4 className="form-section mt-2">
                        <i className="ft-shield"></i> Perfil de Usuario
                      </h4>
                      <div className="row">
                        <div className="col-md-6">
                          {/* RECIBE NOTIFICACIONES POR MAIL */}
                          <div className="form-group row">
                            <label className="col-md-4 label-control col-form-label text-nowrap" htmlFor="notificacionesActivas">
                              Notificaciones por mail:
                            </label>
                            <div className="col-md-8 mt-auto">
                              <Switch
                                onChange={this.handleNotificacionesActivasChange}
                                checked={formData.usuario && formData.usuario.notificacionesActivas ? formData.usuario.notificacionesActivas : false}
                                id="notificacionesActivas"
                                name="notificacionesActivas"
                                disabled={this.state.props.action === 'VIEW' ? true: false }
                                offColor="#FF4961"
                                onColor="#28D094"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{display: formData.esUsuario ? '' : 'none' }}>
                        <div className="row">
                          {/* USUARIO */}
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label className="col-md-4 label-control col-form-label text-nowrap" htmlFor="usuario">
                                Usuario{requiredSymbol}:
                              </label>
                              <div className="col-md-8">
                                {this.props.action === 'VIEW' ? (
                                <div className="form-control-static col-form-label form-value">{formData.usuario && formData.usuario.usuario ? formData.usuario.usuario : ''}</div>
                                ) : (
                                <div>
                                  <input type="text" className="form-control" id="usuario" name="usuario" placeholder="(Requerido)" value={formData.usuario ? formData.usuario.usuario : ''} onChange={this.handleUsuarioFormChange} />
                                  <div className="help-block text-danger field-message" hidden={validationState.formData.usuario.usuario.pristine || validationState.formData.usuario.usuario.valid}>{validationState.formData.usuario.usuario.message}</div>
                                </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* PERFIL */}
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label className="col-md-4 label-control col-form-label text-nowrap" htmlFor="perfil">
                                Perfill{formData.esUsuario ? requiredSymbol : ''}:
                              </label>
                              <div className="col-md-8">
                                {this.props.action === 'VIEW' ? (
                                <div className="form-control-static col-form-label form-value">{formData.usuario ? (formData.usuario.perfil ? formData.usuario.perfil.nombre: '') : ''}</div>
                                ) : (
                                <div>
                                  <Select
                                    id="perfil"
                                    name="perfil"
                                    placeholder={!state.perfilesLoading ? 'Seleccione' : ''}
                                    options={this.state.perfiles}
                                    valueKey='id'
                                    labelKey='nombre'
                                    value={formData.usuario ? formData.usuario.perfil : null }
                                    onChange={(e) => this.handlePerfilChange("perfil", e)}
                                    isLoading={state.perfilesLoading}
                                    disabled={state.perfilesLoading}
                                  />
                                  {<div className="help-block text-danger field-message" hidden={validationState.formData.usuario.perfil.pristine || validationState.formData.usuario.perfil.valid}>{validationState.formData.usuario.perfil.message}</div>
                                  }
                                </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                           {/* MOVILES */}
                          <div className="col-md-6">
                            <div style={{display: this.state.hasPermisoMovil ? '' : 'none' }}>
                              <div className="form-group row">
                                <label className="col-md-4 label-control col-form-label text-nowrap" htmlFor="movil">
                                  Móvil:
                                </label>
                                <div className="col-md-8">
                                  {this.props.action === 'VIEW' ? (
                                  <div className="form-control-static col-form-label form-value">{formData.usuario ? (formData.usuario.movil ? formData.usuario.movil.dominio : '') : ''}</div>
                                  ) : (
                                  <div>
                                    <Select
                                      id="movil"
                                      name="movil"
                                      placeholder="Seleccione"
                                      options={state.moviles}
                                      valueKey='value'
                                      labelKey='label'
                                      value={formData.usuario && movil ? { value: movil.id, label: movil.label } : null}
                                      onChange={(e) => this.handleFormChangeUsuarioSelectObject("movil", e)}
                                    />
                                  </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* GERENCIADORES */}
                          <div className="col-md-6">
                            <div style={{display: this.state.hasPermisoGerenciador ? '' : 'none' }}>
                              <div className="form-group row">
                                <label className="col-md-4 label-control col-form-label text-nowrap" htmlFor="gerenciador">
                                  Gerenciador:
                                </label>
                                <div className="col-md-8">
                                  {this.props.action === 'VIEW' ? (
                                  <div className="form-control-static col-form-label form-value">{formData.usuario ? (formData.usuario.gerenciador ? formData.usuario.gerenciador.razonSocial : '') : ''}</div>
                                  ) : (
                                  <div>
                                    <Select
                                      id="gerenciador"
                                      name="gerenciador"
                                      placeholder="Seleccione"
                                      options={state.gerenciadores}
                                      valueKey='value'
                                      labelKey='label'
                                      value={formData.usuario && gerenciador ? { value: gerenciador.id, label: gerenciador.label } : null}
                                      onChange={(e) => this.handleFormChangeUsuarioSelectObject("gerenciador", e)}
                                    />
                                  </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div style={{display: (this.state.hasPermisoBases && !this.state.hasPermisoTrabajarTodasBases) ? '' : 'none' }}>
                              {/* BASES */}
                              {this.props.action === 'VIEW' ? (
                                <div className="row">
                                  <div className="col-md-6">
                                    {this.state.basesAsignadas && this.state.basesAsignadas.length ? (
                                    <div className="form-group row">
                                      <div className="col-md-4"></div>
                                      <div className="col-md-8">
                                        <table className="table table-bordered">
                                          <thead className="thead-fleet">
                                            <tr>
                                              <th scope="col">Bases Asignadas</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                          {this.state.basesAsignadas.map((base, index)=>{
                                            return(
                                              <tr key={index}>
                                                <td className="align-middle">{base}</td>
                                              </tr>
                                            );
                                          })}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                    ) : (<p>Esta persona no cuenta con bases asignadas.</p>)}
                                  </div>
                                </div>
                              ) : (
                              <div className="form-group">
                                <select multiple="multiple" size="10" ref="duallistbox" value={this.state.basesAsignadas} onChange={this.handleBasesChange}>
                                { state.basesDisponibles.map(function(base) {
                                  return <option className="pl-1" key={base.value} value={base.value}>{base.label}</option>;
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
			</React.Fragment>
		);
	}
}

export default PersonasAbm;