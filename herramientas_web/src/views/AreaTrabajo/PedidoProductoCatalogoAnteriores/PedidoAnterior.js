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
import {getPedidoPorId} from '../../../services/PedidoServices';


import Select from 'react-select';
import Validator from '../../../utils/Validator.js';
import FormValidation from '../../../utils/FormValidation';
import 'react-datepicker/dist/react-datepicker.css';

class PedidoAnterior extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pedidoAnterior: {
                id: null,
                fechaRecibido: "",
                recibido: false,
                entregado: false,
                cobrado: false,
                campania: {id: null},

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
        this.idPedido = props.match.params.id;

        this.urlCancelar = "/areatrabajo/pedidosanteriores/pedidosanteriores";
        console.log(this);


        this.submitForm = this.submitForm.bind(this);


    }

    componentDidMount() {

        let component = this;
        let arrayPromises = [];
        if (component.idPedido) {
            let p1 = getPedidoPorId(component.idPedido).then(result => result.json());
            arrayPromises.push(p1);
        }


        Promise.all(arrayPromises)
            .then(
                (result) => {
                    let miState = {...this.state};

                    if (component.idPedido) {
                        miState.pedido = result[0];
                        console.log(result);

                    }

                    miState.loaded = true;

                    component.setState(miState);


                })

            .catch(function (err) {
                console.log(err);
            })
        console.log(this.state.pedidoAnterior);
    }

    submitForm(event) {
        event.preventDefault();
        let pedidoAnterior = this.state.pedidoAnterior;


    }


    newData(event) {
        let newState = {...this.state};
        newState.pedidoAnterior[event.target.name] = event.target.value;
        this.setState(newState);
    }

    render() {
        if (!this.state.loaded)
            return null;

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
                        {!this.idPersona ? "Pedido" : "Pedido"}
                    </CardHeader>
                    <CardBody>

                        <Row xs={{size: 12, offset: 0}}>


                        </Row>


                    </CardBody>
                    <CardFooter style={estilosFooter}>
                        <Button type="submit" color="success" size="xs"
                        >
                            {!this.idPedido ? "Crear" : "Modificar"}
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

export default PedidoAnterior;