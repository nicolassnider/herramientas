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
import Select from 'react-select';


import {getCampaniaActiva} from '../../../services/CampaniaServices';
import FormValidation from "../../../utils/FormValidation";
import Validator from "../../../utils/Validator";
import {getCatalogoPorId} from "../../../services/CatalogoService";

class CampaniaActual extends Component {

    constructor(props) {
        super(props);
        this.state = {
            campaniaActual: {
                id: null,
                fechaInicio: "",
                fechaFin: "",
                descripcion: "",
                activo: false
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


            this.idCampaniaActual = props.match.params.id;


        this.urlCancelar = "/administracion/catalogos";


        this.formValidation = new FormValidation({
            component: this,
            validators: {}
        });
    }

    componentDidMount() {

        let component = this;
        let arrayPromises = [];
        let p1 = getCampaniaActiva().then(result => result.json());
        arrayPromises.push(p1);
        Promise.all(arrayPromises)
            .then(
                (result) => {
                    console.log(result);
                    let miState = {...this.state};

                    miState.loaded = true;
                    miState.campaniaActual.id = result[0].id;
                    miState.campaniaActual.fechaInicio = result[0].fechaInicio;
                    miState.campaniaActual.fechaFin = result[0].fechaFin;
                    miState.campaniaActual.descripcion = result[0].descripcion;


                    component.setState(miState)


                })
            .catch(function (err) {
                console.log(err);
            })
    }

    render() {
        if (!this.state.loaded)
            return null;

        const currentState = {...this.state};

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
                    <Row><h1>
                        <Label>Pedidos:</Label>

                    </h1></Row>
                    <Row>
                        <Col sm="4">

                            <Button
                                style={{marginLeft: "5px"}}
                                color="success"
                            >
                                Cargar Items al Pedido
                            </Button>
                        </Col>
                        <Col sm="4">

                            <Button
                                style={{marginLeft: "5px"}}
                                color="success"
                            >
                                Cerrar Pedido
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="3">
                            <ListGroup id="list-tab" role="tablist">

                            </ListGroup>
                        </Col>
                        <Col sm="9">

                        </Col>
                    </Row>

                    <div style={divStyle}>
                        hola
                    </div>
                </CardBody>
                <CardFooter style={{textAlign: "right"}}>
                    <Button
                        style={{marginLeft: "5px"}}
                        color="success"
                    >
                        Guardar
                    </Button>
                    <Button
                        style={{marginLeft: "5px"}}
                        color="success"
                        onClick={() => this.props.history.push({
                            pathname: '/presentacion/resumen',
                            state: {serie: "1", a: 1}
                        })}
                    >
                        Envío de Resultados
                    </Button>
                    <Button
                        style={{marginLeft: "5px"}}
                        color="danger"
                        onClick={() => this.props.history.push("/")}
                    >
                        Cancelar
                    </Button>
                </CardFooter>
            </Card>

        );
    }
}

export default CampaniaActual;