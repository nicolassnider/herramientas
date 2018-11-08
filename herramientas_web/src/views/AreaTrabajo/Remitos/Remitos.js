import React, {Component} from 'react';
import {Row, Col, Alert, Card, CardHeader, Button, CardBody} from 'reactstrap';
import {getRemitosPorFactura, grillaRemitos} from '../../../services/RemitoServices';

import RemitoGrilla from '../../../components/AreaTrabajo/Remitos/RemitoGrilla';
import Paginador from '../../../components/Paginador/Paginador';


class Remitos extends Component {
    onPageChanged = data => {
        const {currentPage, totalPages, pageLimit} = data;
        const offset = (currentPage - 1) * pageLimit;
        const remitos = this.state.resultado.remitos.slice(offset, offset + pageLimit);

        let miState = {...this.state};
        miState.remitosPorPagina = remitos;
        miState.currentPage = currentPage;
        miState.totalPages = totalPages;
        this.setState(miState);
    }

    constructor(props) {
        super();
        this.state = {
            resultado: {
                remitos: [],
                codigo: 0,
                mensaje: ""
            },
            remitosPorPagina: [],
            currentPage: null,
            totalPages: null,
            facturaId: props.match.params.id,

        }
    }

    componentDidMount() {
        let miState = {...this.state};
        getRemitosPorFactura(miState.facturaId)
            .then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(response => {

                            console.log(response);
                            miState.resultado.remitos = response;
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

                            <RemitoGrilla remitos={this.state.remitosPorPagina}/>
                        </Col>
                        <Col xs="12">
                            <Paginador totalRecords={this.state.resultado.remitos.length}
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
                                onClick={() => this.props.history.push(`/areatrabajo/facturas/remitos/nueva/factura/${this.state.facturaId}`)}>
                            Nuevo <i className="fa fa-plus"></i>
                        </Button>
                    </CardHeader>
                    <CardBody>{content}</CardBody>
                </Card>
            </div>
        );
    };
}

export default Remitos;