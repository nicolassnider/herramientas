import React, {Component} from 'react';
import {
    Label,
    Input,
    FormGroup,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    TabContent,
    TabPane,
    ListGroup,
    CardFooter,
    Button
} from 'reactstrap';

import {getCampaniaPorPedido} from '../../../services/CampaniaServices';
import FormValidation from "../../../utils/FormValidation";
import {pedidoPorCampaniaActual} from "../../../services/PedidoServices";
import {
    getCsvProductoCatalogosPorPedido,
    grillaPedidoProductoCatalogos
} from "../../../services/PedidoProductoCatalogoServices";
import PedidoProductoCatalogoGrilla
    from '../../../components/AreaTrabajo/PedidoProductoCatalogo/PedidoProductoCatalogoGrilla';
import {recibir} from "../../../services/RemitoProductoServices";

class PedidoAnterior extends Component {

    constructor(props) {
        super(props);
        this.state = {
            campania: {
                id: null,
                fechaInicio: "",
                fechaFin: "",
                descripcion: "",
                activo: false,

                grillaPedidos: [],
            },
            idPedido: this.props.match.params.id,
            error: {
                codigo: null,
                mensaje: "",
                detalle: []
            },
            modified: false,
            flagPrimeraVez: true,
            loaded: false
        },


        this.urlCancelar = "/areatrabajo/pedidosanteriores/pedidosanteriores";


        this.formValidation = new FormValidation({
            component: this,
            validators: {}

        });


    }

    componentDidMount() {

        let component = this;
        let arrayp = [];
        let arrayPromises = [];
        let p1 = getCampaniaPorPedido(this.state.idPedido).then(result => result.json());
        arrayp.push(p1);
        Promise.all(arrayp)
            .then(
                (result) => {
                    let miState = {...this.state};
                    miState.loaded = true;
                    miState.campania.id = result[0].id;
                    miState.campania.fechaInicio = result[0].fechaInicio;
                    miState.campania.fechaFin = result[0].fechaFin;
                    miState.campania.descripcion = result[0].descripcion;
                    component.setState(miState);
                })

            .catch(function (err) {
                console.log(err);
            });


        let p2 = grillaPedidoProductoCatalogos(this.state.idPedido).then(result => result.json());
        let arrayp2 = [];
        arrayp2.push(p1, p2);
        Promise.all(arrayp2).then(
            (result) => {
                console.log(result[1]);

                let miState = {...this.state};

                miState.loaded = true;
                miState.campania.grillaPedidos = result[1];
                component.setState(miState);
            })


            .catch(function (err) {
                console.log(err);
            })
        console.log(this.state)


    }


    render() {


        if (!this.state.loaded)
            return null;


        const currentState = {...this.state};


        const divStyle = {
            border: 'blue',
            bordered: true
        };

        function recibirTotal() {


            recibir(currentState.campaniaActual.idPedido);

            setTimeout(2000);
            document.location.reload();


        }


        return (
            <Card>
                <CardHeader>
                    Campaña Actual
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col xs="3">

                            <h1>
                                <Label>Id:</Label>
                                <Label> {currentState.campania.id}</Label>
                            </h1>
                        </Col>
                        <Col xs="3">
                            <h1>
                                <Label>Inicio:</Label>
                                <Label> {currentState.campania.fechaInicio}</Label>
                            </h1>
                        </Col>
                        <Col xs="3">
                            <h1>
                                <Label>Fin de Campaña:</Label>
                                <Label> {currentState.campania.fechaFin}</Label>
                            </h1>
                        </Col>

                    </Row>
                    <Row>
                        <h1>
                            <Label>Pedido:{currentState.idPedido}</Label>

                        </h1>
                    </Row>

                    <Row>
                        <Col sm="4">


                            <Button color="primary"
                                    onClick={() => this.props.history.push(recibirTotal())}>
                                Recibido Total <i className="fa fa-plus"></i>
                            </Button>
                        </Col>
                        <Col sm="4">

                            <Button
                                style={{marginLeft: "5px"}}
                                color="success"
                                onClick={() => this.props.history.push(getCsvProductoCatalogosPorPedido(currentState.campaniaActual.idPedido))}>

                                Imprimir Pedido
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12">
                            <ListGroup id="list-tab" role="tablist">
                                <PedidoProductoCatalogoGrilla
                                    pedidoProductoCatalogos={currentState.campania.grillaPedidos}/>

                            </ListGroup>
                        </Col>
                        <Col sm="9">

                        </Col>
                    </Row>

                    <div style={divStyle}>

                    </div>
                </CardBody>
                <CardFooter style={{textAlign: "right"}}>

                </CardFooter>
            </Card>

        );
    }
}

export default PedidoAnterior;