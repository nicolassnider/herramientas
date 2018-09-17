import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import FormValidation from '../../commons/validation/FormValidation.js'
import Validator from '../../commons/validation/Validator.js'
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'
import Loading from '../ui/Loading.js'
import DropzoneComponent from 'react-dropzone-component/dist/react-dropzone'
import Config from '../../commons/config/Config.js'
import $ from 'jquery'
import Dialog from '../../commons/dialog/Dialog.js'

class TicketCargarPresupuesto extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.ajaxHandler = new AjaxHandler();

		this.state = {
			redirectTo: null,
			props: this.props,
			formData: {
				id: this.props.ticket.id,
				manoDeObra: 0,
				repuestos: 0,
				adjunto: null,
				adicional: false
			},
			errors: [],
			loading: false
		};

		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleCancel = this.handleCancel.bind(this);

		this.formValidation = new FormValidation({
			component: this,
			validators: {
				'formData.manoDeObra': (value) => Validator.floatNunmber(value),
				'formData.repuestos': (value) => Validator.floatNunmber(value),
				'formData.adjunto': (value) => Validator.notEmpty(value)
			}
		});

		this.initFileUpload();
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
				manoDeObra: 0,
				repuestos: 0,
				adjunto: null,
				adicional: false
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

	handleSubmit(event) {
		let formDataCopy = JSON.parse(JSON.stringify(this.state.formData));
		formDataCopy.adicional = this.props.ticket.estado === 'COTIZAR_ADICIONAL' ? true : false;
		this.setState({
			loading: true,
			formData: formDataCopy
		}, () =>{
			this.ajaxHandler.fetch( '/ticket-presupuestos/ticket/' + this.props.ticket.id, {
				method: 'POST',
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
						formData: {
							id: null,
							manoDeObra: 0,
							repuestos: 0,
							adjunto: null,
							adicional: false
						}
					 }, ()=>{
						this.props.callbackSave();
					 });
				}
				window.scrollTo(0,0);
			}).catch((error) => {
				this.ajaxHandler.handleError(error);
			}).finally(() => {
			});
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
				adjunto: null,
				adicional: false
			}
		 }, ()=>{
			this.formValidation.validate();
			this.props.callbackClose();
			 //$('#cargar_presupuesto_modal').modal('toggle');
		 });
	}

	initFileUpload() {
		let component = this;

		this.fileUploadConfig = {
			showFiletypeIcon: this.props.action === 'ADD' ? true : false,
			postUrl: Config.get('apiUrlBase') + '/ticket-presupuestos/adjunto'
		};

		this.fileUploadDjsConfig = {
			addRemoveLinks: false,
			thumbnailMethod: 'crop',
			dictDefaultMessage: component.state.props.action !== 'VIEW' ? "Haga click aquí o <br> arrastre un archivo a este área." : '',
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

			init: function() {
				let dropzone = this;

				this.on('success', (file, response) => {
					file.adjunto = response.archivo;
					let formDataCopy = JSON.parse(JSON.stringify(component.state.formData));
					formDataCopy.adjunto = response.archivo;
					component.setState({
						formData: formDataCopy
					});
				});

				this.on('removedfile', (file) => {
					let formDataCopy = JSON.parse(JSON.stringify(component.state.formData));
					formDataCopy.adjunto = null;
					component.setState({
						formData: formDataCopy
					});

					component.ajaxHandler.fetch('/ticket-presupuestos/adjunto/' + file.adjunto, {
							method: 'DELETE'
						})
						.then(response => {
							if (response.status !== 204) {
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
					if (this.files.length > 1) {
		              this.removeFile(this.files[0]);
		            }
		            $(file.previewElement).find('.dz-image').on("click", function() {
		              dropzone.hiddenFileInput.click();
		            });
					$(file.previewElement).find('.dz-view > a').on('click', (e) => {
						component.ajaxHandler.fetch('/ticket-presupuestos/adjunto/' + file.adjunto, {
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
						}).catch(() => {});

						e.preventDefault();
					});
				});

				if (component.state.props.action === 'VIEW') {
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
								<div className="card pull-up">
									<div className="card-content">
										<div className="card-body">
											<h4 className="form-section">
												<i className="la la-file-text"></i> Presupuesto
												<div className="float-right" style={{fontSize:'14px'}}>* campos requeridos</div>
											</h4>
											<div className="row">
												<div className="col-md-6">
													<div className="form-group row">
														<label className="col-md-6 label-control col-form-label" htmlFor="manoDeObra">
															Mano de Obra{requiredSymbol}:
														</label>
														<div className="col-md-6">
															<div>
																<input type="text" className="form-control text-right pr-1" id="manoDeObra" name="manoDeObra" placeholder="0.00" value={formData.manoDeObra === 0 ? '' : formData.manoDeObra} onChange={this.handleFormChange} />
																<div className="help-block text-danger" hidden={validationState.formData.manoDeObra.pristine || validationState.formData.manoDeObra.valid}>{validationState.formData.manoDeObra.message}</div>
															</div>
														</div>
													</div>
													<div className="form-group row">
														<label className="col-md-6 label-control col-form-label" htmlFor="repuestos">
															Repuestos{requiredSymbol}:
														</label>
														<div className="col-md-6">
															<div>
																<input type="text" className="form-control text-right pr-1" id="repuestos" name="repuestos" placeholder="0.00" value={formData.repuestos === 0 ? '' : formData.repuestos } onChange={this.handleFormChange} />
																<div className="help-block text-danger" hidden={validationState.formData.repuestos.pristine || validationState.formData.repuestos.valid}>{validationState.formData.repuestos.message}</div>
															</div>
														</div>
													</div>
													<div className="form-group row">
														<label className="col-md-6 label-control col-form-label">Total:</label>
														<div className="col-md-6">
															<div className="form-control-static col-form-label form-value text-right pr-1">{((formData.manoDeObra ? parseFloat(formData.manoDeObra) : 0) + (formData.repuestos ? parseFloat(formData.repuestos) : 0)).toFixed(2)}</div>
														</div>
													</div>
												</div>
												<div className="col-md-6">
													<div className="form-group row">
														<div className="col-md-6">
															<label className="col-md-12 label-control col-form-label text-left">Adjunto{requiredSymbol}:</label>
															<DropzoneComponent id="archivos" config={this.fileUploadConfig} eventHandlers={this.fileUploadHandlers} djsConfig={this.fileUploadDjsConfig} />
															<div className="help-block text-danger" hidden={validationState.formData.adjunto.pristine || validationState.formData.adjunto.valid}>{validationState.formData.adjunto.message}</div>
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

export default TicketCargarPresupuesto;
