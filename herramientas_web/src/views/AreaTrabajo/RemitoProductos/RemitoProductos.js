import React, {Component} from 'react';
import {Row, Col, Alert, Card, CardHeader, Button, CardBody} from 'reactstrap';
import {descargaRemitoProductosPorRemito, getAllRemitoPoductoPorRemito} from '../../../services/RemitoProductoServices';

import RemitoProductoGrilla from '../../../components/AreaTrabajo/RemitoProductos/RemitoProductoGrilla';
import Paginador from '../../../components/Paginador/Paginador';
import {descargaProductoCatalogosPorPedido} from "../../../services/PedidoProductoCatalogoServices";


class RemitoProductos extends Component {
    onPageChanged = data => {
        const {currentPage, totalPages, pageLimit} = data;
        const offset = (currentPage - 1) * pageLimit;
        const remitoProductos = this.state.resultado.remitoProductos.slice(offset, offset + pageLimit);

        let miState = {...this.state};
        miState.remitoProductosPorPagina = remitoProductos;
        miState.currentPage = currentPage;
        miState.totalPages = totalPages;
        this.setState(miState);
    }

    constructor(props) {
        super();
        this.state = {
            resultado: {
                remitoProductos: [],
                codigo: 0,
                mensaje: ""
            },
            remitoProductosPorPagina: [],
            currentPage: null,
            totalPages: null,
            remitoId: props.match.params.id,

        }
    }

    componentDidMount() {
        let miState = {...this.state};
        getAllRemitoPoductoPorRemito(miState.remitoId)
            .then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(response => {
                            miState.resultado.remitoProductos = response;
                            miState.resultado.codigo = 2000;
                            this.setState(miState);

                        })
                } else {
                    if (response.status === 500) {
                        this.setState({
                            resultado: {
                                codigo: 5000,
                                mensaje: "Error al listar los remitos disponibles."
                            }
                        });
                    }
                }
            });
    }

    render() {

        const addBtn = {
            textAlign: 'right'
        }
        let content = null;
        if (this.state.resultado.codigo === 2000) {
            content =
                (
                    <Row>
                        <Col xs="12">

                            <RemitoProductoGrilla remitoProductos={this.state.remitoProductosPorPagina}/>
                        </Col>
                        <Col xs="12">
                            <Paginador totalRecords={this.state.resultado.remitoProductos.length}
                                       pageLimit={10}
                                       pageNeighbours={2}
                                       onPageChanged={this.onPageChanged}
                                       align="center"/>
                        </Col>
                    </Row>
                )
        } else if (this.state.resultado.codigo === 5000) {
            content =
                (
                    <Row>
                        <Alert color="warning">
                            <strong>{this.state.resultado.mensaje}</strong>
                        </Alert>
                    </Row>
                )
        }

        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader style={addBtn}>
                        <Button color="primary"
                                onClick={() => this.props.history.push(`/areatrabajo/facturass/remitos/incluirproductosenremito/${this.state.remitoId}`)}>
                            Nuevo <i className="fa fa-plus"></i>
                        </Button>
                        <Button color="primary"
                                onClick={() => this.props.history.push(descargaRemitoProductosPorRemito(this.state.remitoId))}>
                            Comparar con pedido <i className="fa fa-pencil"></i>
                        </Button>
                    </CardHeader>
                    <CardBody>{content}</CardBody>
                </Card>
            </div>
        );
    };
}

export default RemitoProductos;