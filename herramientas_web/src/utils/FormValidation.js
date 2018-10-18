class FormValidation {
    constructor(props) {
        this.component = props.component;
        this.validators = props.validators;
        this.initialState = JSON.parse(JSON.stringify(this.component.state));
        this.state = {};

        for (let field in this.validators) {
            let fieldState = {
                dirty: false,
                pristine: true,
                valid: true,
                message: ''
            }
            this.index(this.state, field, fieldState);
        }
        this.state.form = {
            dirty: false,
            pristine: true,
            valid: true,
        }
    }

    validate() {
        for (let field in this.validators) {
            let fieldInitialValue = this.index(this.initialState, field);
            let fieldValue = this.index(JSON.parse(JSON.stringify(this.component.state)), field);
            let fieldChanged = fieldValue !== fieldInitialValue;
            let validator = this.validators[field];
            let fieldState = this.index(this.state, field);

            let fieldValidation = validator(fieldValue);

            fieldState = {
                dirty: fieldChanged ? true : fieldState.dirty,
                pristine: fieldChanged ? false : fieldState.pristine,
                valid: fieldValidation.valid,
                message: !fieldValidation.valid && fieldValidation.message ? fieldValidation.message : ''
            }
            this.index(this.state, field, fieldState);
        }

        this.state.form.valid = true;
        for (let field in this.validators) {
            let fieldState = this.index(this.state, field);
            this.state.form.dirty = this.state.form.dirty || fieldState.dirty;
            this.state.form.pristine = this.state.form.pristine && fieldState.pristine;
            this.state.form.valid = this.state.form.valid && fieldState.valid;
        }
    }

    index(obj, is, value) {
        if (typeof is === 'string') {
            return this.index(obj, is.split('.'), value);
        } else if (is.length === 1 && value !== undefined) {
            return obj[is[0]] = value;
        } else if (is.length === 0) {
            return obj;
        } else {
            if (!obj[is[0]] && value !== undefined) obj[is[0]] = {};
            if (!obj[is[0]]) return null;
            return this.index(obj[is[0]], is.slice(1), value);
        }
    }
}

export default FormValidation;