import React, { Component } from 'react';
import { Row, Col, Alert, Card, CardHeader, Button, CardBody } from 'reactstrap';
import { grillaLaboratorios } from '../../../services/LaboratoriosServices';

import LaboratoriosGrilla from '../../../components/Laboratorios/LaboratoriosGrilla';
import Paginador from '../../../components/Paginador/Paginador';

class Laboratorios extends Component {
    constructor() {
        super();
        this.state = {
            resultado: {
                laboratorios: [],
                codigo: 0,
                mensaje: ""
            },
            laboratoriosPorPagina: [],
            currentPage: null,
            totalPages: null
        }
    }

    onPageChanged = data => {
        const { currentPage, totalPages, pageLimit } = data;
        const offset = (currentPage - 1) * pageLimit;
        const laboratorios = this.state.resultado.laboratorios.slice(offset, offset + pageLimit);

        this.setState({
            laboratoriosPorPagina: laboratorios,
            currentPage: currentPage,
            totalPages: totalPages
        })
    }

    componentDidMount() {
        grillaLaboratorios()
            .then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(response => {
                            this.setState({
                                resultado: {
                                    laboratorios: response,
                                    codigo: 2000
                                }
                            });
                        })
                } else {
                    if (response.status === 500) {
                        this.setState({
                            resultado: {
                                codigo: 5000,
                                mensaje: "Error al listar los laboratorios disponibles."
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
                            <LaboratoriosGrilla laboratorios={this.state.laboratoriosPorPagina} />
                        </Col>
                        <Col xs="12">
                            <Paginador totalRecords={this.state.resultado.laboratorios.length}
                                pageLimit={10}
                                pageNeighbours={2}
                                onPageChanged={this.onPageChanged}
                                align="center" />
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
                            onClick={() => this.props.history.push('/configuracion/laboratorios/nuevo')}>
                            Nuevo <i className="fa fa-plus"></i>
                        </Button>
                    </CardHeader>
                    <CardBody>{content}</CardBody>
                </Card>
            </div>
        );
    };
}

export default Laboratorios;