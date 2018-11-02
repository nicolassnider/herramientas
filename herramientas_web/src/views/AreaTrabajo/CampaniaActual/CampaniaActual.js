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

import {getCampaniaActiva} from '../../../services/CampaniaServices';
import FormValidation from "../../../utils/FormValidation";
import {pedidoPorCampaniaActual} from "../../../services/PedidoServices";
import {
    getCsvProductoCatalogosPorPedido,
    grillaPedidoProductoCatalogos
} from "../../../services/PedidoProductoCatalogoServices";
import PedidoProductoCatalogoGrilla
    from '../../../components/AreaTrabajo/PedidoProductoCatalogo/PedidoProductoCatalogoGrilla';

class CampaniaActual extends Component {

    constructor(props) {
        super(props);
        this.state = {
            campaniaActual: {
                id: null,
                fechaInicio: "",
                fechaFin: "",
                descripcion: "",
                activo: false,

                grillaPedidos: [],
            },
            idPedido: null,
            error: {
                codigo: null,
                mensaje: "",
                detalle: []
            },
            modified: false,
            flagPrimeraVez: true,
            loaded: false
        },


            this.urlCancelar = "/administracion/catalogos";


        this.formValidation = new FormValidation({
            component: this,
            validators: {}

        });


    }

    componentDidMount() {

        let component = this;
        let arrayp = [];
        let arrayPromises = [];
        let p1 = getCampaniaActiva().then(result => result.json());
        arrayp.push(p1);
        Promise.all(arrayp)
            .then(
                (result) => {

                    let miState = {...this.state};
                    console.log(result);


                    miState.loaded = true;
                    miState.campaniaActual.id = result[0].id;
                    miState.campaniaActual.fechaInicio = result[0].fechaInicio;
                    miState.campaniaActual.fechaFin = result[0].fechaFin;
                    miState.campaniaActual.descripcion = result[0].descripcion;
                    component.setState(miState);
                    console.log(this.state);
                })

            .catch(function (err) {
                console.log(err);
            });


        let p2 = pedidoPorCampaniaActual().then(result => result.json());
        let arrayp2 = [];
        arrayp2.push(p1, p2);
        Promise.all(arrayp2).then(
            (result) => {

                let miState = {...this.state};


                miState.loaded = true;
                miState.idPedido = result[1].id;
                console.log(miState.idPedido);


                component.setState(miState);
                let p3 = grillaPedidoProductoCatalogos(miState.idPedido).then(result => result.json());

                arrayPromises.push(p3);
                Promise.all(arrayPromises)
                    .then(
                        (result) => {
                            console.log(result);

                            let miState = {...this.state};
                            miState.campaniaActual.grillaPedidos = result[0];

                            miState.loaded = true;


                            component.setState(miState)


                        })

                    .catch(function (err) {
                        console.log(err);
                    })


            })

            .catch(function (err) {
                console.log(err);
            })


    }


    render() {


        if (!this.state.loaded)
            return null;


        const currentState = {...this.state};
        console.log(currentState);


        const divStyle = {
            border: 'blue',
            bordered: true
        };


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
                                <Label> {currentState.campaniaActual.id}</Label>
                            </h1>
                        </Col>
                        <Col xs="3">
                            <h1>
                                <Label>Inicio:</Label>
                                <Label> {currentState.campaniaActual.fechaInicio}</Label>
                            </h1>
                        </Col>
                        <Col xs="3">
                            <h1>
                                <Label>Fin de Campaña:</Label>
                                <Label> {currentState.campaniaActual.fechaFin}</Label>
                            </h1>
                        </Col>

                    </Row>
                    <Row>
                        <h1>
                            <Label>Pedido:{currentState.campaniaActual.idPedido}</Label>

                        </h1>
                    </Row>

                    <Row>
                        <Col sm="4">

                            <Button color="primary"
                                    onClick={() => this.props.history.push('/areatrabajo/campania/campaniaactual/pedido/incluirenpedido/' + currentState.campaniaActual.idPedido)}>
                                Cargar Item <i className="fa fa-plus"></i>
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
                                    pedidoProductoCatalogos={currentState.campaniaActual.grillaPedidos}/>

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

export default CampaniaActual;