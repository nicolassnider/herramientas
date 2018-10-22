import React, {Component} from 'react';
import {
    Input, Col, Alert, Card, Form, FormFeedback, CardHeader, CardBody, CardFooter, Button, Row, FormGroup, Label
} from 'reactstrap';
import {getRevendedoraPorId, editarRevendedora, nuevoRevendedora} from '../../../../services/RevendedorasServices';
import {getAllCategoriaRevendedoras} from '../../../../services/CategoriaRevendedoraServices';
import {selectPersonasSinRevendedora} from '../../../../services/PersonaServices';

import Switch from 'react-switch';
import Select from 'react-select';
import Validator from '../../../../utils/Validator.js';
import FormValidation from '../../../../utils/FormValidation';
import Date from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

class Revendedora extends Component {
    constructor(props) {
        super(props);
        this.state = {
            revendedora: {
                id: null,
                categoriaRevendedora: {
                    id: null
                },
                categoriaRevendedoras: {
                    id: ''
                },
                activo: true,
                persona: {
                    id: null
                },
                personas: {
                    id: ''
                },
                usuario: {
                    id: null
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
        this.idRevendedora = props.match.params.id;

        this.urlCancelar = "/administracion/personas/revendedoras";


        this.submitForm = this.submitForm.bind(this);
        this.handleSwitch = this.handleSwitch.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.newData = this.newData.bind(this);

        this.formValidation = new FormValidation({
            component: this,
            validators: {
                'revendedora.categoriaRevendedora': (value) => Validator.notEmpty(value),
                'revendedora.persona': (value) => Validator.notEmpty(value)
            }
        });
    }

    handleSwitch(checked) {
        let newState = {...this.state};
        newState.revendedora.activo = checked;
        this.setState(newState);
    }

    handleSelect(name, object) {
        let newState = {...this.state};

        switch (name) {

            case "categoriaRevendedoras":
                newState.revendedora.categoriaRevendedora.id = object.value;
                break;
            case "personas":
                newState.revendedora.persona.id = object.value;
                break;
        }

        this.setState(newState);

    }


    componentDidMount() {

        let component = this;
        let arrayPromises = [];
        if (component.idRevendedora) {
            let p1 = getRevendedoraPorId(component.idRevendedora).then(result => result.json());
            arrayPromises.push(p1);
        }
        let p2 = getAllCategoriaRevendedoras().then(result => result.json());

        let p3 = selectPersonasSinRevendedora().then(result => result.json());

        arrayPromises.push(p2, p3);

        Promise.all(arrayPromises)
            .then(
                (result) => {
                    let miState = {...this.state};

                    if (component.idRevendedora) {
                        miState.revendedora = result[0];
                        miState.revendedora.categoriaRevendedoras = result[1].map((categoriaRevendedora, index) => {
                            return (
                                {value: categoriaRevendedora.value, label: categoriaRevendedora.label}
                            )
                        })
                        miState.revendedora.personas = result[2].map((persona, index) => {
                            return (
                                {value: persona.value, label: persona.label}
                            )
                        });
                    } else {
                        miState.revendedora.categoriaRevendedoras = result[0].map((categoriaRevendedora, index) => {
                            return (
                                {value: categoriaRevendedora.value, label: categoriaRevendedora.label}
                            )
                        })
                        miState.revendedora.personas = result[1].map((persona, index) => {
                            return (
                                {value: persona.value, label: persona.label}
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
        let revendedora = this.state.revendedora;
        if (!this.idRevendedora) {
            nuevoRevendedora(revendedora)
                .then(response => {
                    if (response.status === 400) {

                        response.json()
                            .then(response => {
                                this.setState({
                                    error: response,
                                    modified: false,
                                    flagPrimeraVez: false
                                });
                                alert(this.state.error.detalle[0]);

                            })
                    } else {
                        if (response.status === 201) {
                            this.setState({
                                modified: true,
                                error: {
                                    codigo: 2001,
                                    mensaje: "",
                                    detalle: [
                                        "Revendedora creado correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/administracion/personas/revendedorass");
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
            editarRevendedora(revendedora)
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
                                        "Revendedora modificado correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/administracion/personas/revendedoras");
                            }, 2500);
                        }
                    }
                })
        }

    }

    newData(event) {
        let newState = {...this.state};
        newState.revendedora[event.target.name] = event.target.value;
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
                        {!this.idRevendedora ? "Crear Revendedora" : "Modificar Revendedora"}
                    </CardHeader>
                    <CardBody>

                        <Row>
                            <Col xs={{size: 6, offset: 0}}>
                                <Label htmlFor="personas">(*)Persona:</Label>
                                <Select
                                    name="personas" placeholder="Persona..."
                                    valueKey="value" labelKey="label"
                                    options={this.state.revendedora.personas}
                                    value={this.state.revendedora.personas.find(e => e.value === this.state.revendedora.personas.id)}
                                    onChange={(e) => this.handleSelect("personas", e)}
                                />
                            </Col>

                        </Row>

                        <Row xs={{size: 12, offset: 0}}>

                            <Col xs={{size: 2, offset: 0}}>
                                <Label htmlFor="categoriaRevendedoras">(*)Categoría:</Label>
                                <Select
                                    name="categoriaRevendedoras" placeholder="Categoría..."
                                    valueKey="value" labelKey="label"
                                    options={this.state.revendedora.categoriaRevendedoras}
                                    value={this.state.revendedora.categoriaRevendedoras.find(e => e.value === this.state.revendedora.categoriaRevendedoras.id)}
                                    onChange={(e) => this.handleSelect("categoriaRevendedoras", e)}
                                />
                            </Col>
                        </Row>


                        <Row>

                            <Col sm="6" xs="12">
                                <FormGroup>

                                    <Label htmlFor="activo">Activo:</Label> <br/>
                                    <Switch onChange={this.handleSwitch} name="activo"
                                            checked={this.state.revendedora.activo}/>
                                </FormGroup>
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

export default Revendedora;