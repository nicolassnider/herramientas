class FormValidation {
	constructor(props) {
		this.foo = 4;
		this.component = props.component;
		this.formDataState = props.formDataState;
		this.validators = props.validators;

		this.formValidation = {};
		for(let field in this.validators) {
			this.formValidation[field] = {
				dirty: false,
				pristine: true,
				valid: true,
				message: ''
			}
		}
		this.formValidation.form = {
			dirty: false,
			pristine: true,
			valid: true,
		}

		this.component.setState({
			formValidation: this.formValidation
		}, () => this.init());
	}

	init() {
		let formValidationCopy = JSON.parse(JSON.stringify(this.component.state.formValidation))
		
		for(let field in formValidationCopy) {
			if(field !== 'form') {
				let fieldValidation = this.validators[field](this.component.state[this.formDataState][field]);
				formValidationCopy[field] = {
					dirty: false,
					pristine: true,
					valid: fieldValidation.valid,
					message: !fieldValidation.valid && fieldValidation.message ? fieldValidation.message : ''
				}
			}
		}

		formValidationCopy.form.valid = true;
		for(let field in formValidationCopy) {
			if(field !== 'form') {
				formValidationCopy.form.dirty = formValidationCopy.form.dirty || formValidationCopy[field].dirty;
				formValidationCopy.form.pristine = formValidationCopy.form.pristine && formValidationCopy[field].pristine;
				formValidationCopy.form.valid = formValidationCopy.form.valid && formValidationCopy[field].valid;
			}
		}

		this.component.setState({
			formValidation: formValidationCopy
		});
	}

	validate(fieldChanged) {
		let formValidationCopy = JSON.parse(JSON.stringify(this.component.state.formValidation))
		
		for(let field in formValidationCopy) {
			if(field !== 'form') {
				let fieldValidation = this.validators[field](this.component.state[this.formDataState][field]);
				formValidationCopy[field] = {
					dirty: field === fieldChanged ? true : formValidationCopy[field].dirty,
					pristine: field === fieldChanged ? false : formValidationCopy[field].pristine,
					valid: fieldValidation.valid,
					message: !fieldValidation.valid && fieldValidation.message ? fieldValidation.message : ''
				}
			}
		}

		formValidationCopy.form.valid = true;
		for(let field in formValidationCopy) {
			if(field !== 'form') {
				formValidationCopy.form.dirty = formValidationCopy.form.dirty || formValidationCopy[field].dirty;
				formValidationCopy.form.pristine = formValidationCopy.form.pristine && formValidationCopy[field].pristine;
				formValidationCopy.form.valid = formValidationCopy.form.valid && formValidationCopy[field].valid;
			}
		}

		this.component.setState({
			formValidation: formValidationCopy
		});
	}
}

export default FormValidation;