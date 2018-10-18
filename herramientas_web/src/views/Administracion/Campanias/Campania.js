import React, {Component} from 'react';
import {
    Input,
    Col,
    Alert,
    Card,
    Form,
    FormFeedback,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Row,
    FormGroup,
    Label
} from 'reactstrap';
import {
    getCampaniaPorId,
    nuevaCampania,
    editarCampania

} from '../../../services/CampaniaServices';
import Switch from 'react-switch';
import Select from 'react-select';
import Validator from '../../../utils/Validator.js';
import FormValidation from '../../../utils/FormValidation';
import Date from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

class Campania extends Component {
    constructor(props) {
        super(props);
        this.state = {
            campania: {
                id: null,
                fechaInicio: "",
                fechaFin: "",
                descripcion: "",
                activo: false
            },
            error: {
                codigo: null,
                mensaje: "",
                detalle: []
            },
            modified: false,
            flagPrimeraVez: true,
            loaded: false
        },
            this.idCampania = props.match.params.id;

        this.urlCancelar = "/administracion/campanias";

        this.submitForm = this.submitForm.bind(this);
        this.newDate = this.newDate.bind(this);
        this.newData = this.newData.bind(this);
        this.handleSwitch = this.handleSwitch.bind(this);
        //this.handleSelect = this.handleSelect.bind(this);

        this.formValidation = new FormValidation({
            component: this,
            validators: {
                'campania.fechaInicio': (value) => Validator.notEmpty(value),
                'campania.fechaFin': (value) => Validator.notEmpty(value),
                'campania.descripcion': (value) => Validator.lengthNotEmptyNotRequired(value, 200)
            }
        });
    }

    handleSwitch(checked) {
        let newState = {...this.state};
        newState.campania.activo = checked;
        this.setState(newState);
    }

    componentDidMount() {

        let component = this;
        let arrayPromises = [];
        if (component.idCampania) {
            let p1 = getCampaniaPorId(component.idCampania).then(result => result.json());
            arrayPromises.push(p1);
        }
        Promise.all(arrayPromises)
            .then(
                (result) => {
                    let miState = {...this.state};

                    if (component.idCampania) {
                        miState.campania = result[0];

                    }
                    miState.loaded = true;
                    component.setState(miState)


                })
            .catch(function (err) {
                console.log(err);
            })
    }

    submitForm(event) {
        event.preventDefault();
        let campania = this.state.campania;
        if (!this.idCampania) {
            nuevaCampania(campania)
                .then(response => {
                    if (response.status === 400) {
                        response.json()
                        //console.log("Antes",response)
                            .then(response => {
                                //console.log("Después",response)
                                this.setState({
                                    error: response,
                                    modified: false,
                                    flagPrimeraVez: false
                                });
                            })
                    } else {
                        if (response.status === 201) {
                            this.setState({
                                modified: true,
                                error: {
                                    codigo: 2001,
                                    mensaje: "",
                                    detalle: [
                                        "Campania creada correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/administracion/campanias");
                            }, 2500);
                        } else {
                            if (response.status === 500) {
                                this.setState({
                                    modified: true,
                                    error: {
                                        codigo: 5001,
                                        mensaje: "Error, definir mensaje para este status",
                                        detalle: []
                                    },
                                    flagPrimeraVez: false
                                });
                            }
                        }
                    }
                });
        } else {
            editarCampania(campania)
                .then(response => {
                    if (response.status === 400) {
                        response.json()
                            .then(response => {
                                this.setState({
                                    error: response,
                                    modified: false,
                                    flagPrimeraVez: false
                                });
                            })
                    } else {
                        if (response.status === 204) {
                            this.setState({
                                modified: true,
                                error: {
                                    codigo: 2004,
                                    mensaje: "",
                                    detalle: [
                                        "Campania modificada correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/administracion/campanias");
                            }, 2500);
                        }
                    }
                })
        }
        //console.log("Submit", this.state);
    }

    handleSwitch(checked) {
        let newState = {...this.state};
        newState.campania.activo = checked;
        this.setState(newState);
    }

    /*handleSelect(name, object){
        //console.log(object);
        let newState = {...this.state};
        if(name === "determinaciones"){
            newState.metodo.determinacionId = object.value;
        }
        if(name === "unidades"){
            newState.metodo.unidadId = object.value;
        }
        this.setState(newState);
    }*/

    newDate(name, event) {
        let date = event ? event.format() : '';
        let newState = {...this.state};

        switch (name) {
            case "fechaInicio":
                newState.campania.fechaInicio = date;
                break;
            case "fechaFin":
                newState.campania.fechaFin = date;
                break;
        }

        this.setState(newState);
    }

    newData(event) {
        let newState = {...this.state};
        console.log(event.target.value);
        newState.campania[event.target.name] = event.target.value;
        this.setState(newState);
    }


    render() {
        if (!this.state.loaded)
            return null;

        this.formValidation.validate();
        let validationState = this.formValidation.state;

        const estilosFooter = {
            textAlign: 'right',
            button: {
                margin: '5px'
            }
        }

        let mensaje = null;
        if (!this.state.flagPrimeraVez) {
            mensaje =
                !this.state.modified ?
                    this.state.error.codigo === 4000 ?
                        (<Alert color="danger">
                            <strong> {this.state.error.mensaje} </strong> <br/>
                            <ul>
                                {this.state.error.detalle.map((detalle, index) => {
                                    return <li key={index}>{detalle}</li>
                                })}
                            </ul>
                        </Alert>)
                        :
                        (<Alert color="warning">
                            <strong> {this.state.error.mensaje} </strong> <br/>
                            {this.state.error.detalle}
                        </Alert>)
                    :
                    this.state.error.codigo === 2001 || this.state.error.codigo === 2004 ?
                        (<Alert color="success">
                            <h6>{this.state.error.detalle}</h6>
                        </Alert>)
                        :
                        (<Alert color="warning">
                            <strong> {this.state.error.mensaje} </strong>
                            {this.state.error.detalle}
                        </Alert>)
        }

        return (
            <Card>
                <Form onSubmit={this.submitForm}>
                    <CardHeader>
                        {!this.idCampania ? "Crear Campania" : "Modificar Campania"}
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col xs="12">
                                <Label htmlFor="descripcion">Descripcion:</Label>
                                <Input type="text" name="descripcion"
                                       onChange={this.newData} placeholder="Ingresar descripcion"
                                       value={this.state.campania.descripcion}
                                       invalid={!validationState.campania.descripcion.pristine && !validationState.campania.descripcion.valid}/>
                                <FormFeedback
                                    invalid={!validationState.campania.descripcion.pristine && !validationState.campania.descripcion.valid}>{validationState.campania.descripcion.message}</FormFeedback>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="fechaInicio">Fecha de Inicio:</Label>
                                    <Date placeholderText="Seleccionar fecha"
                                          selected={!this.state.campania.fechaInicio || this.state.campania.fechaInicio === '0000-00-00' ? null : moment(this.state.campania.fechaInicio)}
                                          dateFormat="DD/MM/YYYY"
                                          className="form-control date-picker-placeholder"
                                          onChange={(event) => this.newDate("fechaInicio", event)}

                                          invalid={!validationState.campania.fechaInicio.pristine && !validationState.campania.fechaInicio.valid}/>
                                    <FormFeedback
                                        invalid={!validationState.campania.fechaInicio.pristine && !validationState.campania.fechaInicio.valid}>{validationState.campania.fechaInicio.message}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col sm="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="fechaFin">Fecha de Fin:</Label>
                                    <Date placeholderText="Seleccionar fecha"
                                          selected={!this.state.campania.fechaFin || this.state.campania.fechaFin === '0000-00-00' ? null : moment(this.state.campania.fechaFin)}
                                          dateFormat="DD/MM/YYYY"
                                          className="form-control date-picker-placeholder"
                                          onChange={(event) => this.newDate("fechaFin", event)}

                                          invalid={!validationState.campania.fechaFin.pristine && !validationState.campania.fechaFin.valid}/>
                                    <FormFeedback
                                        invalid={!validationState.campania.fechaFin.pristine && !validationState.campania.fechaFin.valid}>{validationState.campania.fechaFin.message}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm="6" xs="12">
                                <FormGroup>

                                    <Label htmlFor="activo">Activo:</Label> <br/>
                                    <Switch onChange={this.handleSwitch} name="activo"
                                            checked={this.state.campania.activo}/>
                                </FormGroup>
                            </Col>
                        </Row>


                    </CardBody>
                    <CardFooter style={estilosFooter}>
                        <Button type="submit" color="success" size="xs"
                                disabled={!validationState.form.valid}>
                            {!this.idCampania ? "Crear" : "Modificar"}
                        </Button>
                        <Button type="submit" color="danger" size="xs"
                                onClick={() => this.props.history.push(this.urlCancelar)}>
                            Cancelar
                        </Button>
                    </CardFooter>
                </Form>
            </Card>
        )
    }

}

export default Campania;