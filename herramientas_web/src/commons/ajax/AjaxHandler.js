import Config from '../../commons/config/Config.js'
import swal from 'sweetalert'

class AjaxHandler {
	constructor(component) {
		this.component = null;
	}

	subscribe(component) {
		this.component = component;
	}

	unsubscribe(component) {
		this.component = null;
	}

	getJson(service) {
		if(this.component) {
			return new Promise((resolve, reject) => {
				this.fetch(service, {
					method: 'GET',
				}).then(response => {
					if(this.component) {
						resolve(response.json());
					} else {
						return null;
					}
				}).catch(error => {
					if(this.component) {
						reject(error);
					} else {
						return null;
					}						
				});
			});
		} else {
			console.log('AjaxHandler: Component not subscribed.');
			return null;
		}
	}

	fetch(service, options) {
		if(this.component) {
			return new Promise((resolve, reject) => {
				fetch(Config.get('apiUrlBase') + service, 
					Object.assign(options, {
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
							'Authorization-Token': localStorage.getItem("token")
						}
					})
				)
				.then(response => {
					if(this.component) {
						this.handleResponseErrorsIsValid(response.clone())
						.then(error => {
							if(!error) {
								resolve(response);
							} else {
								reject(new TypeError(error));
							}
						});
					} else {
						return null;
					}
				}).catch(error => {
					if(this.component) {
						if(error) this.handleError(error);
						reject(error);
					} else {
						return null;
					}
				});
			});
		} else {
			console.log('AjaxHandler: Component not subscribed.');
			return null;
		}
	}

	handleResponseErrorsIsValid(response) {
		return new Promise((resolve, reject) => {
			let message, detail, messageResponse, detailResponse;

			if(response.status === 401) {
				message = 'La sesión expiró.';
				detail = 'Por favor, ingrese nuevamente.';
			} else if(response.status === 403) {
				message = 'No tiene permisos para realizar esta acción.';
				detail = 'Contacte al administrador.';
			} else if(response.status >= 404) {
				message = 'Error interno del sistema.';
				detail = 'Contacte al administrador.';
			}

			if(message) {
				let waitForResponse = new Promise((resolve, reject) => {	
					if(response.responseJSON) {
						messageResponse = response.responseJSON.mensaje;
						detailResponse = response.responseJSON.detail;
						resolve();
					} else if(response instanceof Response) {
						response.json()
						.then((data) => {
							messageResponse = data.mensaje;
							detailResponse = data.detail;
							resolve();
						})
						.catch(() => {
							console.log('Error');
						});
					} else {
						resolve();
					}
				});

				waitForResponse.then(() => {
					if(response.status === 401) {
						swal({
							title: message,
							text: detail,
							icon: "error",
							buttons: {
								confirm: {
									text: "Aceptar",
									value: true,
									visible: true,
									className: "btn btn-primary",
									closeModal: true
								}
							}
						}).then((isConfirm) => {
							if (isConfirm) {
								window.location.reload();
							}
						});
						resolve(message);
					} else if(response.status === 403) {
						swal({
							title: messageResponse ? messageResponse : message,
							text: detail + (detailResponse ? ('\n' + detailResponse) : ''),
							icon: "error",
							buttons: {
								confirm: {
									text: "Aceptar",
									value: true,
									visible: true,
									className: "btn btn-primary",
									closeModal: true
								}
							}
						});
						resolve(message);
					} else if(response.status >= 404) {
						swal({
							title: message,
							text: detail,
							icon: "error",
							buttons: {
								confirm: {
									text: "Aceptar",
									value: true,
									visible: true,
									className: "btn btn-primary",
									closeModal: true
								}
							}
						}).then((isConfirm) => {
							if (isConfirm) {
								resolve(message);
							}
						});						
					}
				})
				.catch(() => {
					console.log('Error');
				});
			} else {
				resolve(null);
			}
		});
	}

	handleError(error) {
		if(error) {
			swal({
				title: "Error interno del sistema.",
				text: "Contacte al administrador.",
				icon: "error",
				buttons: {
					confirm: {
						text: "Aceptar",
						value: true,
						visible: true,
						className: "btn btn-primary",
						closeModal: true
					}
				}
			});
		}
	}
}

export default AjaxHandler;