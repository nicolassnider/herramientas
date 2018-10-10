import moment from 'moment'
import 'moment/min/locales'

class Validator {
	static notEmpty(value) {
		let valid = value === null ? false : /\S/.test(value);		
		return {
			valid: valid,
			message: !valid ? 'Dato requerido' : ''
		};
    }
    
    static lengthNotEmpty(value, max) {
        let notEmptyResult = this.notEmpty(value);
        if (!notEmptyResult.valid)
            return notEmptyResult;
        let valid = value.length <= max;
        return {
            valid: valid,
            message: !valid ? `Máximo ${max} caracteres` : ''
        }
	}
	
	static lengthNotEmptyNotRequired(value, max) {		
		if(!this.notEmpty(value)){
			this.lengthNotEmpty(value, max);
		}else{
			return {
				valid: true,
				message: ''
			}
		}		
	}

	static intIsSmallerThan(value, maximun){		
		let intNumberResult = this.intNumber(value);
		if(!intNumberResult.valid)
			return intNumberResult;
		let maximunNumberResult = this.intNumber(maximun);
		if(!maximunNumberResult.valid){
			return {
				valid: true,
				message: ''
			};
		}else{
			let valid = parseInt(value) <= maximun;
			return {
				valid: valid,
				message: !valid ? `El valor ${value} debe ser menor que ${maximun}` : ''
			}
		}							
	}

	static floatIsSmallerThan(value, maximun){		
		let floatNumberResult = this.floatNunmber(value);
		if(!floatNumberResult.valid)
			return floatNumberResult;
		let maximunNumberResult = this.floatNunmber(maximun);
		if(!maximunNumberResult.valid){
			return {
				valid: true,
				message: ''
			};
		}else{
			let valid = parseFloat(value) <= maximun;
			return {
				valid: valid,
				message: !valid ? `El valor ${value} debe ser menor que ${maximun}` : ''
			}
		}							
	}

	static floatIsSmallerThanNotRequired(value, maximun){		
		if(!this.notEmpty(value)){
			this.floatIsSmallerThan(value, maximun);
		}else{
			return {
				valid: true,
				message: ''
			}
		}
	}


	static intIsGreaterThan(value, minimun){
		let intNumberResult = this.intNumber(value);
		if(!intNumberResult.valid)
			return intNumberResult;
		let minimunNumberResult = this.intNumber(minimun);
		if(!minimunNumberResult.valid){
			return {
				valid: true,
				message: ''
			};
		}else{
			let valid = parseInt(value) >= minimun;
			return {
				valid: valid,
				message: !valid ? `El valor ${value} debe ser mayor que ${minimun}` : ''
			}
		}
	}

	static floatIsGreaterThan(value, minimun){
		let floatNumberResult = this.floatNunmber(value);
		if(!floatNumberResult.valid)
			return floatNumberResult;
		let minimunNumberResult = this.floatNunmber(minimun);
		if(!minimunNumberResult.valid){
			return {
				valid: true,
				message: ''
			};
		}else{
			let valid = parseFloat(value) >= minimun;
			return {
				valid: valid,
				message: !valid ? `El valor ${value} debe ser mayor que ${minimun}` : ''
			}
		}
	}

	static floatIsGreaterThanNotRequired(value, maximun){		
		if(!this.notEmpty(value)){
			this.floatIsGreaterThan(value, maximun);
		}else{
			return {
				valid: true,
				message: ''
			}
		}
	}

	static intNumber(value) {
		let valid = false;
		let message = "Dato inválido";

		if(this.notEmpty(value).valid){
			valid = /^\d+$/.test(value);
			if(valid){
				valid = true;
				message = "";
			} else {
				valid = false;
				message = "Dato inválido";
			}
		} else {
			valid = false;
			message = "Dato requerido";
		}
		return {
			valid: valid,
			message: message
		};
	}

	static intNumberNotRequired(value){		
		if(!this.notEmpty(value)){
			this.intNumber(value);
		}else{
			return {
				valid: true,
				message: ''
			}
		}
	}

	static floatNunmber(value) {
		let valid = !value ? false : /^[+-]?\d+(\.\d+)?$/.test(value);
		return {
			valid: valid,
			message: !valid ? 'Dato requerido' : ''
		};
	}

	static floatNunmberNotRequired(value){
		if(!this.notEmpty(value)){
			this.floatNunmber(value);
		}else{
			return {
				valid: true,
				message: ''
			}
		}
	}


	static conditionalNotEmpty(condition, value) {
		let valid = condition ? this.notEmpty(value).valid : true;
		return {
			valid: valid,
			message: "Dato requerido"
		}
	}

	static email(value) {
		const regexMail  = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let valid = regexMail.test(value);
		return {
			valid: valid,
			message: "Formato inválido"
		}
	}

	static conditionalEmail(condition, value) {
		let valid = false;
		let message = "Email inválido";
		if(condition) {
			if(this.notEmpty(value).valid){
				valid = this.email(value).valid;
			} else {
				valid = false;
				message = "Campo requerido";
			}
		} else {
			if(value){
				valid = this.email(value).valid;
			} else {
				valid = true;
			}
		}
		return {
			valid: valid,
			message: message
		}
	}

	static date(value) {
		var dateFormat = 'DD/MM/YYYY';
		let valid = false;
		moment.locale('es');
		let formatedDate = moment(value).format(dateFormat);
		let date = moment(formatedDate,dateFormat,true);

		if(this.notEmpty(value).valid) {
			valid = value === '0000-00-00'? true : date.isValid();
		} else {
			valid = true;
		}

		return {
			valid: valid,
			message: "Formato inválido"
		};
	}

	static dateAfterToday(value){
		if(this.date(value).valid){
			let valid = false;
			let message = "La fecha debe ser anterior a hoy";
			var dateFormat = 'DD/MM/YYYY';
			moment.locale('es');

			var momentValue = moment(value);
			var momentToday = moment(new Date());
			
			var diffDays = moment.duration(momentValue.diff(momentToday));
			var days = diffDays.asDays();
			
			days < 0 ? valid = false :	valid = true;
			return {
				valid: valid,
				message: message
			};
		} else {
			return this.date(value);
		}
	}

	static patente(value) {
		const regexPatente = /(^[a-zA-Z]{2,2}[0-9]{3,3}[a-zA-Z]{2,2}$)|(^[a-zA-Z]{3,3}[0-9]{3,3}$)/;
		let valid = regexPatente.test(value);
		return {
			valid: valid,
			message: "Formato inválido"
		}
	}

	static fechaVencimiento(fechaAlta, value){
		if(this.date(value).valid) {
			let valid = false;
			let message = "Debe ser mayor a hoy y a la fecha de expedición";
			if(moment(value).isAfter(moment(fechaAlta)) && moment(value).isAfter(moment())){
				valid = true;
				message = '';
			}
			return {
				valid: valid,
				message: message
			};
		} else {
			return this.date(value);
		}
	}

}

export default Validator;