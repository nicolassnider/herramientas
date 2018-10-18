import React, {Component} from 'react';
import {Row, Col, Alert, Card, CardHeader, Button, CardBody} from 'reactstrap';
import {grillaDeterminaciones} from '../../../services/DeterminacionesServices';

import DeterminacionesGrilla from '../../../components/Determinaciones/DeterminacionesGrilla';
import Paginador from '../../../components/Paginador/Paginador';

class Determinaciones extends Component {
    onPageChanged = data => {
        const {currentPage, totalPages, pageLimit} = data;
        const offset = (currentPage - 1) * pageLimit;
        const determinaciones = this.state.resultado.determinaciones.slice(offset, offset + pageLimit);

        this.setState({
            determinacionesPorPagina: determinaciones,
            currentPage: currentPage,
            totalPages: totalPages
        })
    };

    constructor() {
        super();
        this.state = {
            resultado: {
                determinaciones: [],
                codigo: 0,
                mensaje: ""
            },
            determinacionesPorPagina: [],
            currentPage: null,
            totalPages: null
        }
    }

    componentDidMount() {
        grillaDeterminaciones()
            .then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(response => {
                            this.setState({
                                resultado: {
                                    determinaciones: response,
                                    codigo: 2000
                                }
                            });
                        })
                } else {
                    if (response.status === 500) {
                        this.setState({
                            resultado: {
                                codigo: 5000,
                                mensaje: "error al listar las determinaciones disponibles"
                            }
                        });
                    }
                }
            });
    }

    render() {

        const addBtn = {
            textAlign: 'right'
        };
        let content = null;
        if (this.state.resultado.codigo === 2000) {
            content =
                (
                    <Row>
                        <Col xs="12">
                            <DeterminacionesGrilla determinaciones={this.state.determinacionesPorPagina}/>
                        </Col>
                        <Col xs="12">
                            <Paginador totalRecords={this.state.resultado.determinaciones.length}
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
                                onClick={() => this.props.history.push('/configuracion/determinaciones/nuevo')}>
                            Nuevo <i className="fa fa-plus"></i>
                        </Button>
                    </CardHeader>
                    <CardBody>{content}</CardBody>
                </Card>
            </div>
        );
    };
}

export default Determinaciones;