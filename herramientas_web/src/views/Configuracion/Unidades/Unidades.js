import React, {Component} from 'react';
import {Alert, Row, Col, Card, CardBody, Button, CardHeader} from 'reactstrap';
import {grillaUnidades} from '../../../services/UnidadesService';

import UnidadesGrilla from '../../../components/Unidades/UnidadesGrilla';
import Paginador from '../../../components/Paginador/Paginador';

class Unidades extends Component {
    onPageChanged = data => {

        const {currentPage, totalPages, pageLimit} = data;

        const offset = (currentPage - 1) * pageLimit;
        const unidades = this.state.resultado.unidades.slice(offset, offset + pageLimit);

        this.setState({
            unidadesPorPagina: unidades,
            currentPage: currentPage,
            totalPages: totalPages
        })
    }

    constructor() {
        super();
        this.state = {
            resultado: {
                unidades: [],
                codigo: 0,
                mensaje: ""
            },
            unidadesPorPagina: [], //Array que contendrá la cantidad de unidades a mostrar por página.
            currentPage: null,
            totalPages: null
        }
    }

    componentDidMount() {
        grillaUnidades()
            .then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(response => {
                            this.setState({
                                resultado: {
                                    unidades: response,
                                    codigo: 2000
                                }
                            });
                        })
                } else {
                    if (response.status === 500) {
                        this.setState({
                            resultado: {
                                codigo: 5000,
                                mensaje: "Error al listar las unidades disponibles."
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
                            <UnidadesGrilla unids={this.state.unidadesPorPagina}/>
                        </Col>
                        <Col xs="12">
                            <Paginador totalRecords={this.state.resultado.unidades.length}
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
                        <Alert color="warning"><strong>{this.state.resultado.mensaje}</strong></Alert>
                    </Row>
                )
        }

        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader style={addBtn}>
                        <Button
                            color="primary"
                            onClick={() => this.props.history.push('/configuracion/unidades/nueva')}>
                            Nueva <i className="fa fa-plus"></i>
                        </Button>
                    </CardHeader>
                    <CardBody>{content}</CardBody>
                </Card>
            </div>
        );
    };
}

export default Unidades;