import React, {Component} from 'react';
import {Row, Col, Card, CardFooter, CardHeader, CardBody, Button} from 'reactstrap';
import {obtenerPresentacion} from '../../services/PresentacionesService';

class Resumen extends Component {

    constructor(props) {
        super(props);

        if (this.props.location.state) {
            this.state = {
                serie: this.props.location.state,
                loaded: true
            }
        } else {
            this.state = {
                serie: null,
                loaded: false
            }
        }

    }

    componentDidMount() {
        if (this.state.loaded)
            return;

        obtenerPresentacion(this.props.match.params.idSerie)
            .then(result => result.json())
            .then(serie => {
                this.setState({
                    serie: serie,
                    loaded: true
                });
            })
            .catch(error => {
                console.log("Error al obtener serie por id", error);
            })
    }

    render() {

        const currentState = {...this.state};
        if (!currentState.loaded)
            return null;

        return (<Row>
            <Col xs="12">
                <Card>
                    <CardHeader>Presentación</CardHeader>
                    <CardBody>
                        <div>Datos de la serie</div>
                        <hr></hr>
                        <div>Datos del laboratorista</div>
                        <hr></hr>
                        <div>Datos de la presentación</div>
                    </CardBody>
                    <CardFooter style={{textAlign: "right"}}>
                        <Button
                            style={{marginLeft: "5px"}}
                            color="success"
                            onClick={() => this.props.history.push({
                                pathname: '/',
                                state: {serie: "1"}
                            })}
                        >
                            Confirmar
                        </Button>
                        <Button
                            style={{marginLeft: "5px"}}
                            color="danger"
                            onClick={() => this.props.history.goBack()}
                        >
                            Cancelar
                        </Button>
                    </CardFooter>
                </Card>
            </Col>
        </Row>);
    }
}

export default Resumen;