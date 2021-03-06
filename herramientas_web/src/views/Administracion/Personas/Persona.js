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
import {getPersonaPorId, editarPersona, nuevoPersona} from '../../../services/PersonaServices';
import {getAllTipoDocumento} from '../../../services/TipoDocumentoServices';
import {getAllLocalidades} from '../../../services/LocalidadesServices';


import Switch from 'react-switch';
import Select from 'react-select';
import Validator from '../../../utils/Validator.js';
import FormValidation from '../../../utils/FormValidation';
import Date from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

class Persona extends Component {
    constructor(props) {
        super(props);
        this.state = {
            persona: {
                id: null,
                tipoDocumento: {
                    id: null
                },
                tipoDocumentos: {
                    id: ''
                },
                documento: "",
                nombre: "",
                nombreSegundo: "",
                apellido: "",
                apellidoSegundo: "",
                telefono: "",
                email: "",
                localidad: {
                    id: ''
                },
                localidades: {
                    null: ''
                },
                fechaAltaPersona: "",
                esUsuario: "",
                fechaBajaPersona: "",
                nombreUsuario: "",
                activo: true
            },

            error: {
                codigo: null,
                mensaje: "",
                detalle: []
            },
            modified: false,
            flagPrimeraVez: true,
            loaded: false
        };
        this.idPersona = props.match.params.id;

        this.urlCancelar = "/administracion/personas";


        this.submitForm = this.submitForm.bind(this);
        this.handleSwitch = this.handleSwitch.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.newData = this.newData.bind(this);

        this.formValidation = new FormValidation({
            component: this,
            validators: {
                'persona.documento': (value) => Validator.intNumber(value),
                'persona.nombre': (value) => Validator.notEmpty(value),
                'persona.apellido': (value) => Validator.notEmpty(value),

            }
        });
    }


    handleSwitch(checked) {
        let newState = {...this.state};
        newState.persona.activo = checked;
        this.setState(newState);
    }

    handleSelect(name, object) {
        let newState = {...this.state};

        switch (name) {

            case "tipoDocumentos":
                newState.persona.tipoDocumento.id = object.value;
                break;
            case "localidades":
                newState.persona.localidad.id = object.value;
                break;
        }

        this.setState(newState);

    }


    componentDidMount() {

        let component = this;
        let arrayPromises = [];
        if (component.idPersona) {
            let p1 = getPersonaPorId(component.idPersona).then(result => result.json());
            arrayPromises.push(p1);
        }
        let p2 = getAllTipoDocumento().then(result => result.json());

        let p3 = getAllLocalidades().then(result => result.json());


        arrayPromises.push(p2, p3);

        Promise.all(arrayPromises)
            .then(
                (result) => {
                    let miState = {...this.state};

                    if (component.idPersona) {
                        miState.persona = result[0];
                        console.log(result);
                        miState.persona.tipoDocumentos = result[1].map((tipoDocumento, index) => {
                            return (
                                {value: tipoDocumento.value, label: tipoDocumento.label}
                            )
                        })
                        miState.persona.localidades = result[2].map((localidad, index) => {
                            return (
                                {value: localidad.value, label: localidad.label}
                            )
                        });
                    } else {
                        miState.persona.tipoDocumentos = result[0].map((tipoDocumento, index) => {
                            return (
                                {value: tipoDocumento.value, label: tipoDocumento.label}
                            )
                        })
                        miState.persona.localidades = result[1].map((localidad, index) => {
                            return (
                                {value: localidad.value, label: localidad.label}
                            )
                        });
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
        let persona = this.state.persona;
        if (!this.idPersona) {
            nuevoPersona(persona)
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
                                //alert(this.state.error.detalle[0]);

                            })
                    } else {
                        if (response.status === 201) {
                            this.setState({
                                modified: true,
                                error: {
                                    codigo: 2001,
                                    mensaje: "",
                                    detalle: [
                                        "Persona creado correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/administracion/personas");
                            }, 2500);
                        } else {
                            if (response.status === 400) {
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
            editarPersona(persona)
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
                                        "Persona modificado correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/administracion/personas");
                            }, 2500);
                        }
                    }
                })
        }
        //console.log("Submit", this.state);
    }

    /*handleSelect(name, object){
        //console.log(object);
        let newState = {...this.state};
        if(name === "tipoDocumento"){
            newState.persona.tipoDocumentoId = object.value;
        }
        if(name === "localidades"){
            newState.persona.unidadId = object.value;
        }
        this.setState(newState);
    }*/

    newData(event) {
        let newState = {...this.state};
        newState.persona[event.target.name] = event.target.value;
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
                        {!this.idPersona ? "Crear Persona" : "Modificar Persona"}
                    </CardHeader>
                    <CardBody>

                        <Row xs={{size: 12, offset: 0}}>

                            <Col xs={{size: 2, offset: 0}}>
                                <Label htmlFor="tipoDocumentos">(*)Tipo de Documento:</Label>
                                <Select
                                    name="tipoDocumentos" placeholder="Tipo de documento..."
                                    valueKey="value" labelKey="label"
                                    options={this.state.persona.tipoDocumentos}
                                    value={this.state.persona.tipoDocumentos.find(e => e.value === this.state.persona.tipoDocumentos.id)}
                                    onChange={(e) => this.handleSelect("tipoDocumentos", e)}
                                />
                            </Col>

                            <Col xs={{size: 4, offset: 0}}>
                                <Label htmlFor="documento">(*)N° Doc:</Label>
                                <Input type="text" name="documento"
                                       onChange={this.newData} placeholder="Ingresar documento"
                                       value={this.state.persona.documento}
                                       invalid={!validationState.persona.documento.pristine && !validationState.persona.documento.valid}/>
                                <FormFeedback
                                    invalid={!validationState.persona.pristine && !validationState.persona.documento.valid}>{validationState.persona.documento.message}</FormFeedback>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="6">
                                <Label htmlFor="nombre">(*)Nombre:</Label>
                                <Input type="text" name="nombre"
                                       onChange={this.newData} placeholder="Nombre"
                                       value={this.state.persona.nombre}
                                       invalid={!validationState.persona.nombre.pristine && !validationState.persona.nombre.valid}/>
                                <FormFeedback
                                    invalid={!validationState.persona.pristine && !validationState.persona.nombre.valid}>{validationState.persona.nombre.message}</FormFeedback>
                            </Col>
                            <Col xs="6">
                                <Label htmlFor="nombreSegundo">Segundo Nombre:</Label>
                                <Input type="text" name="nombreSegundo"
                                       onChange={this.newData} placeholder="Segundo Nombre"
                                       value={this.state.persona.nombreSegundo}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="6">
                                <Label htmlFor="apellido">(*)Apellido:</Label>
                                <Input type="text" name="apellido"
                                       onChange={this.newData} placeholder="Apellido"
                                       value={this.state.persona.apellido}
                                       invalid={!validationState.persona.apellido.pristine && !validationState.persona.apellido.valid}/>
                                <FormFeedback
                                    invalid={!validationState.persona.pristine && !validationState.persona.apellido.valid}>{validationState.persona.apellido.message}</FormFeedback>
                            </Col>
                            <Col xs="6">
                                <Label htmlFor="apellidoSegundo">Segundo Apellido:</Label>
                                <Input type="text" name="apellidoSegundo"
                                       onChange={this.newData} placeholder="Segundo Apellido"
                                       value={this.state.persona.apellidoSegundo}/>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={{size: 4, offset: 0}}>
                                <Label htmlFor="localidades">(*)Localidad:</Label>
                                <Select
                                    name="localidades" placeholder="Seleccionar una localidad..."
                                    valueKey="value" labelKey="label"
                                    options={this.state.persona.localidades}
                                    value={this.state.persona.localidades.find(e => e.value === this.state.persona.localidades.id)}
                                    onChange={(e) => this.handleSelect("localidades", e)}
                                />
                            </Col>
                        </Row>


                        <Row>
                            <Col sm="6" xs="12">
                                <FormGroup>

                                    <Label htmlFor="activo">Activo:</Label> <br/>
                                    <Switch onChange={this.handleSwitch} name="activo"
                                            checked={this.state.persona.activo}/>
                                </FormGroup>
                            </Col>
                        </Row>


                    </CardBody>
                    <CardFooter style={estilosFooter}>
                        <Button type="submit" color="success" size="xs"
                                disabled={!validationState.form.valid}>
                            {!this.idPersona ? "Crear" : "Modificar"}
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

export default Persona;