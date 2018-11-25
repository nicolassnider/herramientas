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


import Switch from 'react-switch';
import Select from 'react-select';
import Validator from '../../../utils/Validator.js';
import FormValidation from '../../../utils/FormValidation';
import Date from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CurrencyFormat from 'react-currency-format';
import moment from 'moment';
import {getPersonaPorId} from "../../../services/PersonaServices";
import {getAllTipoDocumento} from "../../../services/TipoDocumentoServices";
import {getAllLocalidades} from "../../../services/LocalidadesServices";
import {getProductoPorId, selectProductos} from "../../../services/ProductoServices";
import {editarRemitoProducto, nuevoRemitoProducto} from "../../../services/RemitoProductoServices";
import {getAllCategoriaProductos} from "../../../services/CategoriaProductoServices";
import {getAllUnidades} from "../../../services/UnidadServices";
import remitoProductos from "../../../components/AreaTrabajo/RemitoProductos/RemitoProductoGrilla";

class RemitoProducto extends Component {
    constructor(props) {
        super(props);

        this.state = {
            remitoProducto: {
                id: null,
                remito: {
                    id: props.match.params.id,
                },
                productos: {
                    id: null
                },
                producto: {
                    id: null
                },
                cantidad: 0,

            },
            idRemitoProducto: props.match.params.id,

            error: {
                codigo: null,
                mensaje: "",
                detalle: []
            },
            modified: false,
            flagPrimeraVez: true,
            loaded: false
        };

        this.urlCancelar = "/areatrabajo/facturas/";


        this.submitForm = this.submitForm.bind(this);
        this.newData = this.newData.bind(this);
        this.handleSelect = this.handleSelect.bind(this);

        this.formValidation = new FormValidation({
            component: this,
            validators: {
                'remitoProducto.cantidad': (value) => Validator.intNumber(value),
                'remitoProducto.producto': (value) => Validator.notEmpty(value),

            }
        });
    }

    componentDidMount() {

        let component = this;
        let arrayPromises = [];

        let p1 = selectProductos().then(result => result.json());
        arrayPromises.push(p1);

        Promise.all(arrayPromises)
            .then(
                (result) => {
                    let miState = {...this.state};

                    miState.remitoProducto.productos = result[0].map((producto, index) => {
                        return (
                            {value: producto.value, label: producto.label}
                        )
                    })


                    miState.loaded = true;
                    component.setState(miState);


                })

            .catch(function (err) {
                console.log(err);
            })
    }

    submitForm(event) {
        event.preventDefault();
        let remitoProducto = this.state.remitoProducto;
        if (!this.idRemitoProducto) {
            nuevoRemitoProducto(remitoProducto)
                .then(response => {
                    if (response.status === 400) {

                        response.json()
                            .then(response => {
                                this.setState({
                                    error: response,
                                    modified: false,
                                    flagPrimeraVez: false
                                });
                                alert(this.state.error.detalle[0])


                            })
                    } else {
                        if (response.status === 201) {
                            this.setState({
                                modified: true,
                                error: {
                                    codigo: 2001,
                                    mensaje: "",
                                    detalle: [
                                        "RemitoProducto creado correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/areatrabajo/facturas/");
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
            editarRemitoProducto(remitoProducto)
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
                                this.props.history.push(`/areatrabajo/facturas/remitos/`);
                            }, 2500);
                        }
                    }
                })
        }
        //console.log("Submit", this.state);
    }

    handleSelect(name, object) {
        let newState = {...this.state};
        if (name === "productos") {
            console.log("productos");
            newState.remitoProducto.producto.id = object.value;
        }
        this.setState(newState);
    }

    newData(event) {
        let newState = {...this.state};
        newState.remitoProducto[event.target.name] = event.target.value;
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
                        <Col> {!this.idRemito ? "Incluir" : "Modificar"}</Col>

                    </CardHeader>
                    <CardBody>
                        <FormGroup xs={{size: 12, offset: 0}}>

                            <Label htmlFor="productos">(*)Producto:</Label>
                            <Select
                                name="productos" placeholder="Producto..."
                                valueKey="value" labelKey="label"
                                options={this.state.remitoProducto.productos}
                                value={this.state.remitoProducto.productos.find(e => e.value === this.state.remitoProducto.productos.id)}
                                onChange={(e) => this.handleSelect("productos", e)}
                            />


                            <Label htmlFor="cantidad">(*)Cantidad:</Label>
                            <Input type="text" name="cantidad"
                                   onChange={this.newData} placeholder="Cantidad(entero)"
                                   value={this.state.remitoProducto.cantidad}
                                   invalid={!validationState.remitoProducto.cantidad.pristine && !validationState.remitoProducto.cantidad.valid}/>
                            <FormFeedback
                                invalid={!validationState.remitoProducto.pristine && !validationState.remitoProducto.cantidad.valid}>{validationState.remitoProducto.cantidad.message}</FormFeedback>


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

export default RemitoProducto;