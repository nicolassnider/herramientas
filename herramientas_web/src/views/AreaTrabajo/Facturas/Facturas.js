import React, {Component} from 'react';
import {Row, Col, Alert, Card, CardHeader, Button, CardBody} from 'reactstrap';
import {grillaFacturas} from '../../../services/FacturaServices';

import FacturaGrilla from '../../../components/AreaTrabajo/Facturas/FacturaGrilla';
import Paginador from '../../../components/Paginador/Paginador';


class Facturas extends Component {
    onPageChanged = data => {
        const {currentPage, totalPages, pageLimit} = data;
        const offset = (currentPage - 1) * pageLimit;
        const facturas = this.state.resultado.facturas.slice(offset, offset + pageLimit);

        let miState = {...this.state};
        miState.facturasPorPagina = facturas;
        miState.currentPage = currentPage;
        miState.totalPages = totalPages;
        this.setState(miState);
    }

    constructor() {
        super();
        this.state = {
            resultado: {
                facturas: [],
                codigo: 0,
                mensaje: ""
            },
            facturasPorPagina: [],
            currentPage: null,
            totalPages: null
        }
    }

    componentDidMount() {
        let miState = {...this.state};
        grillaFacturas()
            .then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(response => {

                            miState.resultado.facturas = response;
                            miState.resultado.codigo = 2000;
                            this.setState(miState);

                        })
                } else {
                    if (response.status === 500) {
                        this.setState({
                            resultado: {
                                codigo: 5000,
                                mensaje: "Error al listar los facturas disponibles."
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

                            <FacturaGrilla facturas={this.state.facturasPorPagina}/>
                        </Col>
                        <Col xs="12">
                            <Paginador totalRecords={this.state.resultado.facturas.length}
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
                                onClick={() => this.props.history.push('/administracion/facturas/nuevo')}>
                            Nueva <i className="fa fa-plus"></i>
                        </Button>
                        <Button color="info"
                                onClick={() => this.props.history.push('/administracion/facturas/revendedoras')}>
                            Adm.Revendedoras <i className="fa fa-plus"></i>
                        </Button>
                        <Button color="warning"
                                onClick={() => this.props.history.push('/administracion/facturas/clientes')}>
                            Adm.Clientes <i className="fa fa-plus"></i>
                        </Button>
                    </CardHeader>
                    <CardBody>{content}</CardBody>
                </Card>
            </div>
        );
    };
}

export default Facturas;