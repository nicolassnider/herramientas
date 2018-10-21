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
import {getClientePorId, editarCliente, nuevoCliente} from '../../../../services/ClientesServices';
import {getAllCategoriaClientes} from '../../../../services/CategoriaClienteServices';
import {selectPersonasSinCliente} from '../../../../services/PersonaServices';
import {selectRevendedoras} from '../../../../services/RevendedorasServices';


import Switch from 'react-switch';
import Select from 'react-select';
import Validator from '../../../../utils/Validator.js';
import FormValidation from '../../../../utils/FormValidation';
import Date from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

class Cliente extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cliente: {
                id: null,
                categoriaCliente: {
                    id: null
                },
                categoriaClientes: {
                    id: ''
                },
                direccionEntrega: "",
                fechaAltaCliente: "",
                fechaBajaCliente: "",
                anioNacimiento: "",
                madre: false,
                apodo: "",
                persona: {
                    id: null
                },
                personas: {
                    id: null
                },
                activo: true,
                revendedora: {
                    id: ''
                },
                revendedoras: {
                    id: ''
                }

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
        this.idCliente = props.match.params.id;

        this.urlCancelar = "/administracion/personas/clientes";


        this.submitForm = this.submitForm.bind(this);
        this.handleSwitch = this.handleSwitch.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.newDate = this.newDate.bind(this);
        this.newData = this.newData.bind(this);

        this.formValidation = new FormValidation({
            component: this,
            validators: {
                'cliente.categoriaCliente': (value) => Validator.notEmpty(value),
                'cliente.direccionEntrega': (value) => Validator.notEmpty(value),
                'cliente.persona': (value) => Validator.notEmpty(value),
                'cliente.apodo': (value) => Validator.notEmpty(value),


            }
        });
    }


    handleSwitch(checked) {
        let newState = {...this.state};
        newState.cliente.activo = checked;
        this.setState(newState);
    }

    handleSwitchMadre(checked) {
        let newState = {...this.state};
        newState.cliente.madre = checked;
        this.setState(newState);
    }

    handleSelect(name, object) {
        let newState = {...this.state};

        switch (name) {

            case "categoriaClientes":
                newState.cliente.categoriaCliente.id = object.value;
                break;
            case "personas":
                newState.cliente.persona.id = object.value;
                break;
            case "revendedoras":
                newState.cliente.revendedora.id = object.value;
                break;
        }

        this.setState(newState);

    }


    componentDidMount() {

        let component = this;
        let arrayPromises = [];
        if (component.idCliente) {
            let p1 = getClientePorId(component.idCliente).then(result => result.json());
            arrayPromises.push(p1);
        }
        let p2 = getAllCategoriaClientes().then(result => result.json());

        let p3 = selectPersonasSinCliente().then(result => result.json());
        let p4 = selectRevendedoras().then(result => result.json());


        arrayPromises.push(p2, p3, p4);

        Promise.all(arrayPromises)
            .then(
                (result) => {
                    let miState = {...this.state};

                    if (component.idCliente) {
                        miState.cliente = result[0];
                        console.log(result);
                        miState.cliente.categoriaClientes = result[1].map((categoriaCliente, index) => {
                            return (
                                {value: categoriaCliente.value, label: categoriaCliente.label}
                            )
                        })
                        miState.cliente.personas = result[2].map((persona, index) => {
                            return (
                                {value: persona.value, label: persona.label}
                            )
                        })
                        miState.cliente.revendedoras = result[3].map((revendedora, index) => {
                            return (
                                {value: revendedora.value, label: revendedora.label}
                            )
                        });
                    } else {
                        miState.cliente.categoriaClientes = result[0].map((categoriaCliente, index) => {
                            return (
                                {value: categoriaCliente.value, label: categoriaCliente.label}
                            )
                        })
                        miState.cliente.personas = result[1].map((persona, index) => {
                            return (
                                {value: persona.value, label: persona.label}
                            )
                        })
                        miState.cliente.revendedoras = result[2].map((revendedora, index) => {
                            return (
                                {value: revendedora.value, label: revendedora.label}
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
        let cliente = this.state.cliente;
        if (!this.idCliente) {
            nuevoCliente(cliente)
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
                                        "Cliente creado correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/administracion/personas/clientes");
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
            editarCliente(cliente)
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
                                        "Cliente modificado correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/administracion/personas/clientes");
                            }, 2500);
                        }
                    }
                })
        }

    }


    newDate(name, event) {
        let date = event ? event.format() : '';
        let newState = {...this.state};

        switch (name) {
            case "anioNacimiento":
                newState.cliente.anioNacimiento = date;
                break;

        }

        this.setState(newState);
    }

    newData(event) {
        let newState = {...this.state};
        newState.cliente[event.target.name] = event.target.value;
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
                        {!this.idCliente ? "Crear Cliente" : "Modificar Cliente"}
                    </CardHeader>
                    <CardBody>

                        <Row>
                            <Col xs={{size: 6, offset: 0}}>
                                <Label htmlFor="personas">(*)Persona:</Label>
                                <Select
                                    name="personas" placeholder="Persona..."
                                    valueKey="value" labelKey="label"
                                    options={this.state.cliente.personas}
                                    value={this.state.cliente.personas.find(e => e.value === this.state.cliente.personas.id)}
                                    onChange={(e) => this.handleSelect("personas", e)}
                                />
                            </Col>
                            <Col xs="6">
                                <Label htmlFor="apodo">Apodo:</Label>
                                <Input type="text" name="apodo"
                                       onChange={this.newData} placeholder="Apodo"
                                       value={this.state.cliente.apodo}
                                       invalid={!validationState.cliente.apodo.pristine && !validationState.cliente.apodo.valid}/>
                                <FormFeedback
                                    invalid={!validationState.cliente.pristine && !validationState.cliente.apodo.valid}>{validationState.cliente.apodo.message}</FormFeedback>
                            </Col>
                        </Row>

                        <Row xs={{size: 12, offset: 0}}>

                            <Col xs={{size: 2, offset: 0}}>
                                <Label htmlFor="categoriaClientes">(*)Categoría:</Label>
                                <Select
                                    name="categoriaClientes" placeholder="Categoría..."
                                    valueKey="value" labelKey="label"
                                    options={this.state.cliente.categoriaClientes}
                                    value={this.state.cliente.categoriaClientes.find(e => e.value === this.state.cliente.categoriaClientes.id)}
                                    onChange={(e) => this.handleSelect("categoriaClientes", e)}
                                />
                            </Col>

                            <Col xs={{size: 4, offset: 0}}>
                                <Label htmlFor="direccionEntrega">(*)Dirección de entrega:</Label>
                                <Input type="text" name="direccionEntrega"
                                       onChange={this.newData} placeholder="Dirección de entrega"
                                       value={this.state.cliente.direccionEntrega}
                                       invalid={!validationState.cliente.direccionEntrega.pristine && !validationState.cliente.direccionEntrega.valid}/>
                                <FormFeedback
                                    invalid={!validationState.cliente.pristine && !validationState.cliente.direccionEntrega.valid}>{validationState.cliente.direccionEntrega.message}</FormFeedback>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs="6">
                                <Label htmlFor="anioNacimiento">Fecha de nacimiento:</Label>
                                <Date placeholderText="Seleccionar fecha"
                                      selected={!this.state.cliente.anioNacimiento || this.state.cliente.anioNacimiento === '0000-00-00' ? null : moment(this.state.cliente.anioNacimiento)}
                                      dateFormat="DD/MM/YYYY"
                                      className="form-control date-picker-placeholder"
                                      onChange={(event) => this.newDate("anioNacimiento", event)}/>
                            </Col>

                        </Row>
                        <Row>
                            <Col sm="6" xs="12">
                                <FormGroup>

                                    <Label htmlFor="madre">Es Madre?:</Label> <br/>
                                    <Switch onChange={this.handleSwitchMadre} name="madre"
                                            checked={this.state.cliente.madre}/>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>

                            <Col sm="6" xs="12">
                                <FormGroup>

                                    <Label htmlFor="activo">Activo:</Label> <br/>
                                    <Switch onChange={this.handleSwitch} name="activo"
                                            checked={this.state.cliente.activo}/>
                                </FormGroup>
                            </Col>

                        </Row>
                        <Row>
                            <Col xs={{size: 6, offset: 0}}>
                                <Label htmlFor="revendedoras">(*)Revendedora:</Label>
                                <Select
                                    name="revendedoras" placeholder="Seleccionar una Revendedora..."
                                    valueKey="value" labelKey="label"
                                    options={this.state.cliente.revendedoras}
                                    value={this.state.cliente.revendedoras.find(e => e.value === this.state.cliente.revendedoras.id)}
                                    onChange={(e) => this.handleSelect("revendedoras", e)}
                                />
                            </Col>
                        </Row>


                    </CardBody>
                    <CardFooter style={estilosFooter}>
                        <Button type="submit" color="success" size="xs"
                                disabled={!validationState.form.valid}>
                            {!this.idCliente ? "Crear" : "Modificar"}
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

export default Cliente;