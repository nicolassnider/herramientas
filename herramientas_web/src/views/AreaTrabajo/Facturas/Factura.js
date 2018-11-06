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
import {getFacturaPorId, editarFactura, nuevoFactura} from '../../../services/FacturaServices';
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

class Factura extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            factura: {
                id: null,
                total: 0,
                fechaVencimiento: null,
                campania: {
                    id: props.match.params.id,
                },
                pagado: false,
                nroFactura: "",

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

        this.urlCancelar = "/administracion/facturas";


        this.submitForm = this.submitForm.bind(this);
        this.newDate = this.newDate.bind(this);
        this.newData = this.newData.bind(this);

        this.formValidation = new FormValidation({
            component: this,
            validators: {
                'factura.nroFactura': (value) => Validator.intNumber(value),
                'factura.fechaVencimiento': (value) => Validator.notEmpty(value),

            }
        });
    }

    componentDidMount() {

        let component = this;


        let miState = {...this.state};
        miState.loaded = true;
        component.setState(miState)


    }

    submitForm(event) {
        event.preventDefault();
        let factura = this.state.factura;
        if (!this.idFactura) {
            nuevoFactura(factura)
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
                                        "Factura creado correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/administracion/facturas");
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
            editarFactura(factura)
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
                                        "Factura modificado correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/administracion/facturas");
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
            newState.factura.tipoDocumentoId = object.value;
        }
        if(name === "localidades"){
            newState.factura.unidadId = object.value;
        }
        this.setState(newState);
    }*/

    newData(event) {
        let newState = {...this.state};
        newState.factura[event.target.name] = event.target.value;
        this.setState(newState);
    }

    newDate(name, event) {
        let date = event ? event.format() : '';
        let newState = {...this.state};

        switch (name) {
            case "fechaVencimiento":
                newState.factura.fechaVencimiento = date;
                break;
        }

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
                        {!this.idFactura ? "Crear Factura" : "Modificar Factura"}
                    </CardHeader>
                    <CardBody>
                        <FormGroup xs={{size: 12, offset: 0}}>
                            <Row>

                                <Label htmlFor="fechaVencimiento">Fecha de Vencimiento:</Label>
                                <Date placeholderText="Seleccionar fecha"
                                      selected={!this.state.factura.fechaVencimiento || this.state.factura.fechaVencimiento === '0000-00-00' ? null : moment(this.state.factura.fechaVencimiento)}
                                      dateFormat="DD/MM/YYYY"
                                      className="form-control date-picker-placeholder"
                                      onChange={(event) => this.newDate("fechaVencimiento", event)}

                                      invalid={!validationState.factura.fechaVencimiento.pristine && !validationState.factura.fechaVencimiento.valid}/>
                                <FormFeedback
                                    invalid={!validationState.factura.fechaVencimiento.pristine && !validationState.factura.fechaVencimiento.valid}>{validationState.factura.fechaVencimiento.message}</FormFeedback>
                            </Row>
                            <Row xs={{size: 12, offset: 0}}>
                                <Col xs={{size: 4, offset: 0}}>
                                    <Label htmlFor="nroFactura">(*)N° Factura:</Label>
                                    <Input type="text" name="nroFactura"
                                           onChange={this.newData} placeholder="Ingresar numero de factura"
                                           value={this.state.factura.nroFactura}
                                           invalid={!validationState.factura.nroFactura.pristine && !validationState.factura.nroFactura.valid}/>
                                    <FormFeedback
                                        invalid={!validationState.factura.pristine && !validationState.factura.nroFactura.valid}>{validationState.factura.nroFactura.message}</FormFeedback>
                                </Col>
                            </Row>
                            <Row xs={{size: 6, offset: 0}}>
                                <Col xs={{size: 4, offset: 0}}>
                                    <Label htmlFor="total">(*)Total:</Label>
                                    <CurrencyFormat name="total"
                                                    onChange={this.newData} placeholder="Ingresar numero de factura"
                                                    value={this.state.factura.total}/>

                                </Col>
                            </Row>
                        </FormGroup>


                    </CardBody>
                    <CardFooter style={estilosFooter}>
                        <Button type="submit" color="success" size="xs"
                                disabled={!validationState.form.valid}>
                            {!this.idFactura ? "Crear" : "Modificar"}
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

export default Factura;