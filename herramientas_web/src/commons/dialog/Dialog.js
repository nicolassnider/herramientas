import swal from 'sweetalert'

class Dialog {
	static alert(options) {
		swal({
			title: options && options.title ? options.title : "Error interno del sistema.",
			text: options && options.text ? options.text : "Contacte al administrador.",
			icon: options && options.icon ? options.icon : "error",
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

export default Dialog;