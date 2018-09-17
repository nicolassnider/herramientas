import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Security from '../../commons/security/Security.js'
import $ from 'jquery'
import 'bootstrap4-duallistbox'
import 'bootstrap4-duallistbox/dist/bootstrap-duallistbox.css'
import FormValidation from '../../commons/validation/FormValidation.js'
import Validator from '../../commons/validation/Validator.js'
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'
import ConfigBusiness from '../../commons/config/ConfigBusiness.js'
import Loading from '../ui/Loading.js'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import moment from 'moment'
import 'moment/min/locales'
import 'react-datepicker/dist/react-datepicker.css'
import Switch from "react-switch"
import 'react-dropzone-component/styles/filepicker.css'
import 'dropzone/dist/min/dropzone.min.css'
import '../../assets/css/vec-dropzone.css'

class CorrectivosAbm extends Component {
	constructor(props) {
		super(props);

    this.ajaxHandler = new AjaxHandler();

    moment.locale('es');

		this.state = {
			redirectTo: null,
			props: this.props,
			formData: {
        id: 0,
        ticketTipo: 'CORRECTIVO',
        persona: null,
        movil: props.movil ? props.movil : null,
        servicio: null,
        autogestion: false,
        abono: false,
        gerenciador: null,
        comentarios: [],
        tareas: [],
        estado: 'ABIERTO',
        kmGenerado: 0,
        detalle: null
      },
      moviles: [],
      gerenciadores: [],
      listaSelectServicio: [],
      listaSelectTareas: [],
      servicioSeleccionado: null,
      tareasSeleccionadas: [],
      errors: [],
      loading: false,
      tareasDisabled: true,
      tareasIsLoading: false,
      gerenciadoresDisabled: true,
      gerenciadoresIsLoading: false,
      tareasAsignables: false
    };

    this.handleServicioChange = this.handleServicioChange.bind(this);
    this.handleTareasChange = this.handleTareasChange.bind(this);
    this.handleDeleteTarea = this.handleDeleteTarea.bind(this);
    this.handleMovilChange = this.handleMovilChange.bind(this);
    this.handleInputFormChange = this.handleInputFormChange.bind(this);
    this.handleAutogestionChange = this.handleAutogestionChange.bind(this);
    this.handleAbonoChange = this.handleAbonoChange.bind(this);
    this.handleComentarioChange = this.handleComentarioChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.formValidation = new FormValidation({
			component: this,
			validators: {
        'formData.movil': (value) => Validator.notEmpty(value)
			}
    });
  }

  componentDidMount() {
    if(Security.hasPermission('MANTENIMIENTOS_CORRECTIVOS_CREAR')) {
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
      this.ajaxHandler.getJson('/moviles/select-with-base-filtered-by-user'),
      this.ajaxHandler.getJson('/servicios/tipo-ticket/CORRECTIVO/select'),
      ConfigBusiness.get('mantenimientos.correctivo.tareasAsignables')
    ]).then((data) => {
      let moviles = data[0];
      let servicios = data[1];
      let tareasAsignables = data[2];

      component.setState({
        moviles: moviles,
        servicios: servicios,
        tareasAsignables: tareasAsignables === 'true' ? true: false
      }, () => {
        window.scrollTo(0, 0);
        if(this.props.match.params.movilId) {
          this.handleMovilChange({ value: this.props.match.params.movilId, label: this.props.match.params.movilDominio })
        }
        $('#movil').focus();
      });
    }).catch(function(error) {
      component.ajaxHandler.handleError(error);
    }).finally(() => {
      component.setState({ loading: false });
    });
  }

  componentWillUnmount() {
    this.ajaxHandler.unsubscribe();
  }

  handleMovilChange(object) {
    let component = this;
    if(object){
      let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
      formDataCopy.movil = {id: object.value, dominio: object.label};
      this.setState({
        formData: formDataCopy
      }, () => {
        this.ajaxHandler.getJson('/moviles/' + object.value)
        .then((data) => {
          let movil = data;
          let gerenciador = this.state.formData.autogestion ? null : (movil.base && movil.base.gerenciador ? movil.base.gerenciador : null);
          let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
          formDataCopy.kmGenerado = data.kmActual ? data.kmActual : 0;
          if(ConfigBusiness.get('mantenimientos.correctivo.abono.habilitado') === 'true') {
            this.setState({
              formData: formDataCopy,
              gerenciadoresIsLoading: true
            });
            this.ajaxHandler.getJson('/gerenciadores/tipo/1/subregion/' + movil.base.subregion.id + '/select')
            .then((data2) => {
              let gerenciadores = data2;
              let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
              formDataCopy.movil = movil;
              this.setState({
                gerenciadores: gerenciadores,
                gerenciadoresIsLoading: false,
                gerenciadoresDisabled: false,
                formData: formDataCopy
              });
            }).catch(function(error) {
              this.ajaxHandler.handleError(error);
            });
          } else {
            let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
            formDataCopy.movil = movil;
            formDataCopy.gerenciador = gerenciador;
            this.setState({
              formData: formDataCopy
            });
          }
        }).catch(function(error) {
          component.ajaxHandler.handleError(error);
        });
      });
    } else {
      let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
      formDataCopy.movil = null;
      formDataCopy.gerenciador = null;
      this.setState({
        formData: formDataCopy,
        gerenciadoresDisabled: true
      });
    }
  }

  handleGerenciadorChange(object) {
    if(object){
      let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
      formDataCopy.gerenciador = {id: object.value, razonSocial: object.label};
      this.setState({
        formData: formDataCopy
      });
    } else {
      let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
      formDataCopy.gerenciador = null;
      this.setState({
        formData: formDataCopy
      });
    }
  }

  handleAutogestionChange(autogestion) {
    let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy.autogestion = autogestion;
		this.setState({
			formData: formDataCopy
    });
  }

  handleAbonoChange(abono) {
    let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
    formDataCopy.abono = abono;
    if(abono) formDataCopy.gerenciador = null;
		this.setState({
			formData: formDataCopy
    });
  }

  handleServicioChange(object) {
    if(object) {
      this.setState({
        servicioSeleccionado: object,
        tareasIsLoading: true
      }, () => {
        this.ajaxHandler.getJson('/tareas/servicio/' + object.value + '/select')
        .then((data) => {
          let listaSelectTareas = data;
          this.setState({
            listaSelectTareas: listaSelectTareas,
            tareasDisabled: false,
            tareasIsLoading: false
          }, () => {
            if(!this.tareasAsignables) {
              let tareas = [];

              this.state.listaSelectTareas.map((listaSelectTarea)=>{
                tareas.push({
                  id: listaSelectTarea.value,
                  nombre: listaSelectTarea.label,
                  servicio: {
                    id: this.state.servicioSeleccionado.value,
                    nombre: this.state.servicioSeleccionado.label
                  }
                });
                return listaSelectTarea;
              });

              this.loadTareas(tareas);
            }
          });
        }).catch(function(error) {
          AjaxHandler.handleError(error);
        });
      });
    } else {
      this.setState({
        servicioSeleccionado: null,
        tareasSeleccionadas: [],
        tareasDisabled: true
      });
    }
  }

  handleTareasChange(value) {
    this.setState({
      tareasSeleccionadas: value
    });
	}

  loadTareas(tareas) {
    let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
    tareas.map((tarea)=>{
      if(formDataCopy.tareas.findIndex(x => x.id === tarea.id) === -1) {
        formDataCopy.tareas.push(tarea);
      }
      return tareas;
    });

		this.setState({
      formData: formDataCopy,
      servicioSeleccionado: null,
      tareasSeleccionadas: [],
      tareasDisabled: true
    });
  }

  handleAddTarea() {
    let tareas = [];

    this.state.tareasSeleccionadas.map((tareaSeleccionada)=>{
      tareas.push({
        id: tareaSeleccionada.value,
        nombre: tareaSeleccionada.label,
        servicio: {
          id: this.state.servicioSeleccionado.value,
          nombre: this.state.servicioSeleccionado.label
        }
      });
      return tareaSeleccionada;
    });

    this.loadTareas(tareas);
  }

  handleDeleteTarea(index) {
    let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy.tareas.splice(index, 1);
		this.setState({
			formData: formDataCopy
    });
  }

  handleComentarioChange(event) {
		const target = event.target;
		const value = target.value;

    let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
    let comentario = { comentario: value };
		formDataCopy.comentarios.length > 0 ? formDataCopy.comentarios[0] = comentario : formDataCopy.comentarios.push(comentario);
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
    if(this.state.formData.tareas && this.state.formData.tareas.length > 0 ){
      let servicio = this.state.formData.tareas[0].servicio;
      let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
      formDataCopy.servicio = servicio;
      this.setState({
        formData: formDataCopy,
        loading: true
      },() =>{
        let component = this;
        this.ajaxHandler.fetch('/tickets', {
          method: 'POST',
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
    } else {
      let errors = this.state.errors;
      errors.push('Deber ingresar al menos una tarea.');
      this.setState({
        errors: errors
      });
    }
		event.preventDefault();
	}

	handleCancel(event) {
		this.exit();
	}

	exit() {
		this.setState({
			redirectTo: '/tickets'
    });
	}

	render() {
    this.formValidation.validate();
		let formData = this.state.formData;
    let validationState = this.formValidation.state;

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
                        {/* MOVIL */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-4 label-control col-form-label" htmlFor="base">
                              Movil:
                            </label>
                            <div className="col-md-8">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.movil ? formData.movil.dominio : ''}</div>
                              ) : (
                              <div>
                                <Select
                                  id="movil"
                                  name="movil"
                                  placeholder="Móvil"
                                  options={this.state.moviles}
                                  valueKey='value'
                                  labelKey='label'
                                  value={formData.movil ? {value: formData.movil.id, label: formData.movil.dominio} : null}
                                  onChange={(e) => this.handleMovilChange(e)}
                                />
                                <div className="help-block text-danger field-message" hidden={validationState.formData.movil.pristine || validationState.formData.movil.valid}>{validationState.formData.movil.message}</div>
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* KM */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-4 label-control col-form-label" htmlFor="kmActual">
                              Km. Actual :
                            </label>
                            <div className="col-md-8">
                              <div className="form-control-static col-form-label form-value">{formData.movil ? formData.movil.kmActual : ''}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* DETALLE */}
                        <div className="col-md-12">
                          <div className="form-group row">
                            <label className="col-md-2 label-control col-form-label" htmlFor="detalle">
                              Detallle:
                            </label>
                            <div className="col-md-10">
                              <div>
                                <textarea className="form-control" id="detalle" name="detalle" rows="3" placeholder="Detalle" value={formData.detalle ? formData.detalle : ''} onChange={this.handleInputFormChange}></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* AUTOGESTIÓN */}
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-4 label-control col-form-label text-nowrap" htmlFor="autogestion">
                              Autogestión:
                            </label>
                            <div className="col-md-8">
                              <Switch
                                onChange={this.handleAutogestionChange}
                                checked={formData.autogestion}
                                id="autogestion"
                                name="autogestion"
                                disabled={this.state.props.action === 'VIEW' ? true: false }
                                offColor="#FF4961"
                                onColor="#28D094"
                              />
                            </div>
                          </div>
                        </div>
                        {/* COMENTARIOS */}
                        <div className="col-md-6" style={{display: 'none'}}>
                          <div className="form-group row">
                            <label className="col-md-4 label-control col-form-label" htmlFor="comentarios">
                              Comentario Adicional:
                            </label>
                            <div className="col-md-8">
                              <div>
                                <textarea className="form-control" id="comentarios" name="comentarios" rows="3" placeholder="Comentarios" value={formData.comentarios[0] ? formData.comentarios[0].comentario : ''} onChange={this.handleComentarioChange}></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {/* ABONO */}
                        {ConfigBusiness.get('mantenimientos.correctivo.abono.habilitado') === 'true' ? (
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-md-4 label-control col-form-label text-nowrap" htmlFor="abono">
                              Abono:
                            </label>
                            <div className="col-md-8">
                              <Switch
                                onChange={this.handleAbonoChange}
                                checked={formData.abono}
                                id="abono"
                                name="abono"
                                disabled={this.state.props.action === 'VIEW' ? true: false }
                                offColor="#FF4961"
                                onColor="#28D094"
                              />
                            </div>
                          </div>
                        </div>
                        ) : ''}
                        {/* GERENCIADOR */}
                        <div className="col-md-6" style={{display: formData.abono ? '' : 'none' }}>
                          <div className="form-group row">
                            <label className="col-md-4 label-control col-form-label" htmlFor="gerenciador">
                              Gerenciador:
                            </label>
                            <div className="col-md-8">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.gerenciador ? formData.gerenciador : ''}</div>
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
                                />
                                <div className="help-block text-danger field-message" hidden={validationState.formData.movil.pristine || validationState.formData.movil.valid}>{validationState.formData.movil.message}</div>
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
                        <i className="la la-cog"></i> Tareas
                      </h4>
                      <div className="row">
                        {/* SERVICIO */}
                        <div className="col-md-6 pt-1">
                          <div className="form-group row">
                            <label className="col-md-4 label-control col-form-label" htmlFor="servicio">
                              Servicio:
                            </label>
                            <div className="col-md-8">
                              <div>
                                <Select
                                  id="servicio"
                                  name="servicio"
                                  placeholder="Servicio"
                                  options={this.state.servicios}
                                  valueKey='value'
                                  labelKey='label'
                                  value={this.state.servicioSeleccionado}
                                  onChange={(e) => this.handleServicioChange(e)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="bs-callout-info callout-border-left mb-1 p-1">
                            <strong>Recuerde que...</strong>
                            <p>El primer serivicio seleccionado debe ser el de mayor importancia.</p>
                          </div>
                        </div>
                        {/* TAREAS */}
                        <div className="col-md-5" style={{ display: this.state.tareasAsignables ? '' : 'none' }}>
                          <div className="form-group row">
                            <label className="col-md-3 label-control col-form-label" htmlFor="tareasServicio">
                              Tareas:
                            </label>
                            <div className="col-md-9">
                              {this.props.action === 'VIEW' ? (
                              <div className="form-control-static col-form-label form-value">{formData.cebe ? formData.cebe.nombre : ''}</div>
                              ) : (
                              <div>
                                <Select
                                  id="tareasServicio"
                                  name="tareasServicio"
                                  placeholder="Tareas"
                                  options={this.state.listaSelectTareas}
                                  valueKey='value'
                                  labelKey='label'
                                  closeOnSelect={true}
                                  multi
                                  removeSelected={true}
                                  joinValues
                                  value={this.state.tareasSeleccionadas}
                                  disabled={this.state.tareasDisabled}
                                  isLoading={this.state.tareasIsLoading}
                                  onChange={this.handleTareasChange}
                                />
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-2" style={{ display: this.state.tareasAsignables ? '' : 'none' }}>
                          <a className="btn btn-icon-add text-center text-fleet" role="button" onClick={(e) => this.handleAddTarea()}>
                            <i className="ft-plus-circle"></i>
                          </a>
                        </div>
                      </div>
                      <div className="row" style={{display: formData.tareas.length > 0 ? '' : 'none' }}>
                        {/* TAREAS SELECCIONADAS */}
                        <div className="col-md-12">
                          <table className="table">
                            <thead className="thead-fleet">
                              <tr>
                                <th scope="col">Servicio</th>
                                <th scope="col">Tareas</th>
                                <th scope="col">Eliminar</th>
                              </tr>
                            </thead>
                            <tbody>
                            {formData.tareas.map((tarea, index)=>{
                              return(
                                <tr key={index}>
                                  <td className="align-middle">{tarea.servicio.nombre}</td>
                                  <td className="align-middle">{tarea.nombre}</td>
                                  <td>
                                    <a className="btn btn-icon text-danger" role="button" onClick={(e) => this.handleDeleteTarea(index)}>
                                      <i className="fa fa-trash fa-xs"></i>
								                    </a>
                                  </td>
                                </tr>
                              );
                            })}
                            </tbody>
                          </table>
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

export default CorrectivosAbm;