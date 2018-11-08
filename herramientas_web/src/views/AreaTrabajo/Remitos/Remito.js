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
import {getRemitoPorId, editarRemito, nuevoRemito} from '../../../services/RemitoServices';
import {getAllTipoDocumento} from '../../../services/TipoDocumentoServices';
import {getAllLocalidades} from '../../../services/LocalidadesServices';


import Switch from 'react-switch';
import Select from 'react-select';
import Validator from '../../../utils/Validator.js';
import FormValidation from '../../../utils/FormValidation';
import Date from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CurrencyFormat from 'react-currency-format';
import moment from 'moment';

class Remito extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            remito: {
                id: null,
                factura: {
                    id: props.match.params.id,
                },
                numeroRemito: "",

            },
            facturaId: props.match.params.id,

            error: {
                codigo: null,
                mensaje: "",
                detalle: []
            },
            modified: false,
            flagPrimeraVez: true,
            loaded: false
        };

        this.urlCancelar = "/administracion/remitos";


        this.submitForm = this.submitForm.bind(this);
        this.newData = this.newData.bind(this);

        this.formValidation = new FormValidation({
            component: this,
            validators: {
                'remito.numeroRemito': (value) => Validator.intNumber(value),

            }
        });
    }

    componentDidMount() {

        let component = this;


        let miState = {...this.state};
        miState.loaded = true;
        component.setState(miState);
        console.log(this.state);


    }

    submitForm(event) {
        event.preventDefault();
        let remito = this.state.remito;
        if (!this.idRemito) {
            nuevoRemito(remito)
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
                        if (response.status === 201) {
                            this.setState({
                                modified: true,
                                error: {
                                    codigo: 2001,
                                    mensaje: "",
                                    detalle: [
                                        "Remito creado correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/administracion/remitos");
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
            editarRemito(remito)
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
                                        "Remito modificado correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push(`/areatrabajo/facturas/remitos/nueva/factura/${this.state.facturaId}`);
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
            newState.remito.tipoDocumentoId = object.value;
        }
        if(name === "localidades"){
            newState.remito.unidadId = object.value;
        }
        this.setState(newState);
    }*/

    newData(event) {
        let newState = {...this.state};
        newState.remito[event.target.name] = event.target.value;
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
                        <Col> {!this.idRemito ? "Crear Remito" : "Modificar Remito"}</Col>

                    </CardHeader>
                    <CardBody>
                        <FormGroup xs={{size: 12, offset: 0}}>
                            <Row>

                            </Row>
                            <Row xs={{size: 12, offset: 0}}>
                                <Col xs={{size: 4, offset: 0}}>
                                    <Label htmlFor="numerRemito">(*)N° Remito:</Label>
                                    <Input type="text" name="numeroRemito"
                                           onChange={this.newData} placeholder="Ingresar numero de remito"
                                           value={this.state.remito.numeroRemito}
                                           invalid={!validationState.remito.numeroRemito.pristine && !validationState.remito.numeroRemito.valid}/>
                                    <FormFeedback
                                        invalid={!validationState.remito.pristine && !validationState.remito.numeroRemito.valid}>{validationState.remito.numeroRemito.message}</FormFeedback>
                                </Col>
                            </Row>

                        </FormGroup>


                    </CardBody>
                    <CardFooter style={estilosFooter}>
                        <Button type="submit" color="success" size="xs"
                                disabled={!validationState.form.valid}>
                            {!this.idRemito ? "Crear" : "Modificar"}
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

export default Remito;