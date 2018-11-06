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
import {selectCatalogosSinProducto} from '../../../services/CatalogoService';
import {nuevoPedidoProductoCatalogo} from "../../../services/PedidoProductoCatalogoServices";
import FormValidation from "../../../utils/FormValidation";
import Validator from "../../../utils/Validator";
import Select from 'react-select';
import {selectProductoCatalogos} from "../../../services/ProductoCatalogoServices";
import * as NumericInput from "react-numeric-input";
import {selectClientes} from "../../../services/ClientesServices";

//import 'react-datepicker/dist/react-datepicker.css';

class IncluirProductoEnPedido extends Component {
    constructor(props) {
        console.log("incluirproductoenpedido");
        super(props);
        this.idPedido = props.match.params.id;
        this.state = {
            pedidoProductoCatalogo: {
                "id": null,
                "pedidoAvon": {
                    "id": props.match.params.id,
                },
                "productoCatalogo": {
                    "id": null,
                },
                "productoCatalogos": {
                    "id": null,
                },
                "cantidad": 0,
                "recibido": false,
                "cliente": {
                    "id": null
                },
                "clientes": {
                    "id": null
                },
                "revendedora": {
                    "id": null
                },
                "revendedoras": {
                    "id": null
                }


            },


            error: {
                codigo: null,
                mensaje: "",
                detalle: []
            }
            ,
            modified: false
            ,
            flagPrimeraVez: true
            ,
            loaded: false
        };


        this.urlCancelar = "/areatrabajo/campania/campaniaactual";


        this.submitForm = this.submitForm.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.newData = this.newData.bind(this);

        this.formValidation = new FormValidation({
            component: this,
            validators: {'pedidoProductoCatalogo.cantidad': (value) => Validator.intIsGreaterThan(value, 0)}
        });
    }

    handleSelect(name, object) {
        let newState = {...this.state};

        switch (name) {

            case "productoCatalogos":
                newState.pedidoProductoCatalogo.productoCatalogo.id = object.value;
                break;
            case "clientes":
                newState.pedidoProductoCatalogo.cliente.id = object.value;
                break;
            case "revendedoras":
                newState.pedidoProductoCatalogo.revendedora.id = object.value;
                break;
        }

        this.setState(newState);
        console.log(newState);

    }

    componentDidMount() {


        let component = this;
        let arrayPromises = [];
        let p1 = selectProductoCatalogos().then(result => result.json());
        let p2 = selectClientes().then(result => result.json());
        arrayPromises.push(p1, p2);

        Promise.all(arrayPromises)
            .then(
                (result) => {
                    console.log(result);
                    let miState = {...this.state};

                    if (component.idPersona) {
                        miState.pedidoProductoCatalogo = result[0];
                        console.log(result);
                        miState.pedidoProductoCatalogo.productoCatalogos = result[1].map((productoCatalogo, index) => {
                            return (
                                {value: productoCatalogo.value, label: productoCatalogo.label}
                            )
                        })
                        miState.pedidoProductoCatalogo.clientes = result[2].map((cliente, index) => {
                            return (
                                {value: cliente.value, label: cliente.label}
                            )
                        });
                    } else {
                        miState.pedidoProductoCatalogo.productoCatalogos = result[0].map((productoCatalogo, index) => {
                            return (
                                {value: productoCatalogo.value, label: productoCatalogo.label}
                            )
                        })
                        miState.pedidoProductoCatalogo.clientes = result[1].map((cliente, index) => {
                            return (
                                {value: cliente.value, label: cliente.label}
                            )
                        });
                    }

                    miState.loaded = true;
                    console.log(miState);
                    component.setState(miState);


                })

            .catch(function (err) {
                console.log(err);
            })
    }

    submitForm(event) {
        event.preventDefault();
        let pedidoProductoCatalogo = this.state.pedidoProductoCatalogo;
        if (!this.idProducto) {
            nuevoPedidoProductoCatalogo(pedidoProductoCatalogo)
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
                                        "Producto creado correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                console.log("settimeout");
                                this.props.history.push("/areatrabajo/campania/campaniaactual");
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
            nuevoPedidoProductoCatalogo(pedidoProductoCatalogo)
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
                                        "Producto modificado correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/areatrabajo/campania/campaniaactual");
                            }, 2500);
                        }
                    }
                })
        }

    }


    newData(event) {
        let newState = {...this.state};
        newState.pedidoProductoCatalogo[event.target.name] = event.target.value;
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

                            <Col xs={{size: 4, offset: 0}}>
                                <Label htmlFor="catalogos">(*)Producto por Catálogo:</Label>
                                <Select
                                    name="productoCatalogos" placeholder="Seleccionar un Producto (ver catalogo)..."
                                    valueKey="value" labelKey="label"
                                    options={this.state.pedidoProductoCatalogo.productoCatalogos}
                                    value={this.state.pedidoProductoCatalogo.productoCatalogos.find(e => e.value === this.state.pedidoProductoCatalogo.productoCatalogos.id)}
                                    onChange={(e) => this.handleSelect("productoCatalogos", e)}
                                />
                            </Col>
                            <Col>
                                <Label htmlFor="cantidad">(*)Cantidad:</Label>
                                <Input type="text" name="cantidad"
                                       onChange={this.newData} placeholder="Cantidad(entero)"
                                       value={this.state.pedidoProductoCatalogo.cantidad}
                                       invalid={!validationState.pedidoProductoCatalogo.cantidad.pristine && !validationState.pedidoProductoCatalogo.cantidad.valid}/>
                                <FormFeedback
                                    invalid={!validationState.pedidoProductoCatalogo.pristine && !validationState.pedidoProductoCatalogo.cantidad.valid}>{validationState.pedidoProductoCatalogo.cantidad.message}</FormFeedback>


                            </Col>


                        </Row>

                        <Row>
                            <Col xs={{size: 4, offset: 0}}>
                                <Label htmlFor="clientes">(*)Cliente:</Label>
                                <Select
                                    name="clientes" placeholder="Seleccionar un Cliente..."
                                    valueKey="value" labelKey="label"
                                    options={this.state.pedidoProductoCatalogo.clientes}
                                    value={this.state.pedidoProductoCatalogo.clientes.find(e => e.value === this.state.pedidoProductoCatalogo.clientes.id)}
                                    onChange={(e) => this.handleSelect("clientes", e)}
                                />
                            </Col>
                        </Row>


                    </CardBody>
                    <CardFooter style={estilosFooter}>
                        <Button type="submit" color="success" size="xs"
                                disabled={!validationState.form.valid}>
                            {!this.idProducto ? "Crear" : "Incluir"}
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

export default IncluirProductoEnPedido;