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
    Label,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
} from 'reactstrap';
import {editarProductoCatalogo, getCatalogosPorProductoPorId} from '../../../services/ProductoCatalogoServices';
import {selectCatalogosSinProducto} from '../../../services/CatalogoService';
import {nuevaProductoCatalogo} from "../../../services/ProductoCatalogoServices";
import FormValidation from "../../../utils/FormValidation";
import Validator from "../../../utils/Validator";
import Select from 'react-select';
import {
    getPedidoProductoCatalogoPorId,
    saldarPedidoProductoCatalogo
} from "../../../services/PedidoProductoCatalogoServices";

//import 'react-datepicker/dist/react-datepicker.css';

class IncluirProductoEnCatalogo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pedidoProductoCatalogo: {
                id: null,
                saldo: null,
                saldoAnterior: null,

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
        this.pedidoProductoCatalogoId = props.match.params.id;


        this.urlCancelar = "/areatrabajo/campania/campaniaactual";


        this.submitForm = this.submitForm.bind(this);
        this.newData = this.newData.bind(this);

        this.formValidation = new FormValidation({
            component: this,
            validators: {
                'pedidoProductoCatalogo.saldo': (value) => Validator.notEmpty(value),
            }
        });
    }


    componentDidMount() {

        let component = this;
        let arrayPromises = [];
        let p1 = getPedidoProductoCatalogoPorId(component.pedidoProductoCatalogoId).then(result => result.json());
        arrayPromises.push(p1);

        Promise.all(arrayPromises)
            .then(
                (result) => {
                    let miState = {...this.state};
                    console.log(result);

                    miState.pedidoProductoCatalogo.id = result[0].id;
                    miState.pedidoProductoCatalogo.saldoAnterior = result[0].saldo;


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
        saldarPedidoProductoCatalogo(pedidoProductoCatalogo)
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
                                    "Saldo cargado"
                                ]
                            },
                            flagPrimeraVez: false
                        });
                        setTimeout(() => {
                            this.props.history.push(this.urlCancelar);
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


    }


    newData(event) {
        let newState = {...this.state};
        newState.pedidoProductoCatalogo[event.target.name] = event.target.value;
        this.setState(newState);
        console.log(this.state);
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
                        Saldo Pendiente: ${this.state.pedidoProductoCatalogo.saldoAnterior}
                    </CardHeader>
                    <CardBody>

                        <Row xs={{size: 12, offset: 0}}>

                            <Col xs={{size: 5, offset: 0}}>
                                <Input type="number" min="1" step="any" name="saldo"
                                       onChange={this.newData} placeholder="$"
                                       value={this.state.pedidoProductoCatalogo.saldo}
                                       invalid={!validationState.pedidoProductoCatalogo.saldo.pristine && !validationState.pedidoProductoCatalogo.saldo.valid}/>
                                <FormFeedback
                                    invalid={!validationState.pedidoProductoCatalogo.pristine && !validationState.pedidoProductoCatalogo.saldo.valid}>{validationState.pedidoProductoCatalogo.saldo.message}</FormFeedback>
                            </Col>

                        </Row>


                    </CardBody>
                    <CardFooter style={estilosFooter}>
                        <Button type="submit" color="success" size="xs"
                                disabled={!validationState.form.valid}>
                            {!this.pedidoProductoCatalogoId ? "Error" : "Ingresar Monto"}
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

export default IncluirProductoEnCatalogo;