import React, {Component} from 'react';
import {Row, Col, Alert, Card, CardHeader, Button, CardBody} from 'reactstrap';
import {grillaSeries} from '../../../services/SeriesServices';

import SeriesGrilla from '../../../components/Series/SeriesGrilla';
import Paginador from '../../../components/Paginador/Paginador';

class Series extends Component {
    onPageChanged = data => {
        const {currentPage, totalPages, pageLimit} = data;
        const offset = (currentPage - 1) * pageLimit;
        const series = this.state.resultado.series.slice(offset, offset + pageLimit);

        this.setState({
            seriesPorPagina: series,
            currentPage: currentPage,
            totalPages: totalPages
        })
    }

    constructor() {
        super();
        this.state = {
            resultado: {
                series: [],
                codigo: 0,
                mensaje: ""
            },
            seriesPorPagina: [],
            currentPage: null,
            totalPages: null
        }
    }

    componentDidMount() {
        grillaSeries()
            .then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(response => {
                            this.setState({
                                resultado: {
                                    series: response,
                                    codigo: 2000
                                }
                            });
                        })
                } else {
                    if (response.status === 500) {
                        this.setState({
                            resultado: {
                                codigo: 5000,
                                mensaje: "Error al listar las series disponibles."
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
                            <SeriesGrilla series={this.state.seriesPorPagina}/>
                        </Col>
                        <Col xs="12">
                            <Paginador totalRecords={this.state.resultado.series.length}
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
                                onClick={() => this.props.history.push('/administracion/series/nuevo')}>
                            Nuevo <i className="fa fa-plus"></i>
                        </Button>
                    </CardHeader>
                    <CardBody>{content}</CardBody>
                </Card>
            </div>
        );
    };
}

export default Series;