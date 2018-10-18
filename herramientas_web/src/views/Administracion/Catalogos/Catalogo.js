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
    getCatalogoPorId, desactivarCatalogo, editarCatalogo, eliminarCatalogo, nuevoCatalogo

} from '../../../services/CatalogoService';
import Switch from 'react-switch';
//import Select from 'react-select';
import Validator from '../../../utils/Validator.js';
import FormValidation from '../../../utils/FormValidation';
//import Date from 'react-datepicker';
//import 'react-datepicker/dist/react-datepicker.css';
//import moment from 'moment';

class Catalogo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            catalogo: {
                id: null,
                descripcion: "",
                observaciones: "",
                activo: false,
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
            this.idCatalogo = props.match.params.id;

        this.urlCancelar = "/administracion/catalogos";

        this.submitForm = this.submitForm.bind(this);
        this.handleSwitch = this.handleSwitch.bind(this);
        this.newData = this.newData.bind(this);


        this.formValidation = new FormValidation({
            component: this,
            validators: {
                'catalogo.descripcion': (value) => Validator.notEmpty(value),
                'catalogo.observaciones': (value) => Validator.notEmpty(value),
            }
        });
    }

    handleSwitch(checked) {
        let newState = {...this.state};
        newState.catalogo.activo = checked;
        this.setState(newState);
    }

    componentDidMount() {

        let component = this;
        let arrayPromises = [];
        if (component.idCatalogo) {
            let p1 = getCatalogoPorId(component.idCatalogo).then(result => result.json());
            arrayPromises.push(p1);
        }
        Promise.all(arrayPromises)
            .then(
                (result) => {
                    let miState = {...this.state};

                    if (component.idCatalogo) {
                        miState.catalogo = result[0];

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
        let catalogo = this.state.catalogo;
        if (!this.idCatalogo) {
            nuevoCatalogo(catalogo)
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
                                        "Catalogo creado correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/administracion/catalogos");
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
            editarCatalogo(catalogo)
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
                                        "Catalogo modificado correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/administracion/catalogos");
                            }, 2500);
                        }
                    }
                })
        }

    }

    newData(event) {

        let newState = {...this.state};
        newState.catalogo[event.target.name] = event.target.value;
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
                        {!this.idCatalogo ? "Crear Catalogo" : "Modificar Catalogo"}
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col xs="12">
                                <Label htmlFor="descripcion">Descripcion:</Label>
                                <Input type="text" name="descripcion"
                                       onChange={this.newData} placeholder="Ingresar descripcion"
                                       value={this.state.catalogo.descripcion}
                                       invalid={!validationState.catalogo.descripcion.pristine && !validationState.catalogo.descripcion.valid}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                <Label htmlFor="observaciones">observaciones:</Label>
                                <Input type="text" name="observaciones"
                                       value={this.state.catalogo.observaciones}
                                       onChange={this.newData} placeholder="Ingresar observaciones"
                                       invalid={!validationState.catalogo.observaciones.pristine && !validationState.catalogo.observaciones.valid}/>
                            </Col>
                        </Row>


                        <Row>
                            <Col sm="6" xs="12">
                                <FormGroup>

                                    <Label htmlFor="activo">Activo:</Label> <br/>
                                    <Switch onChange={this.handleSwitch} name="activo"
                                            checked={this.state.catalogo.activo}/>
                                </FormGroup>
                            </Col>
                        </Row>


                    </CardBody>
                    <CardFooter style={estilosFooter}>
                        <Button type="submit" color="success" size="xs"
                                disabled={!validationState.form.valid}>
                            {!this.idCatalogo ? "Crear" : "Modificar"}
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

export default Catalogo;