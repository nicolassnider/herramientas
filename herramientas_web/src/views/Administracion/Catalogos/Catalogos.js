import React, {Component} from 'react';
import {Row, Col, Alert, Card, CardHeader, Button, CardBody} from 'reactstrap';
import {grillaCatalogos} from '../../../services/CatalogoService';

import CatalogoGrilla from '../../../components/Administracion/Catalogos/CatalogoGrilla';
import Paginador from '../../../components/Paginador/Paginador';


class Catalogos extends Component {
    onPageChanged = data => {
        const {currentPage, totalPages, pageLimit} = data;
        const offset = (currentPage - 1) * pageLimit;
        const catalogos = this.state.resultado.catalogos.slice(offset, offset + pageLimit);

        let miState = {...this.state};
        miState.catalogosPorPagina = catalogos;
        miState.currentPage = currentPage;
        miState.totalPages = totalPages;
        this.setState(miState);
    }

    constructor() {
        super();
        this.state = {
            resultado: {
                catalogos: [],
                codigo: 0,
                mensaje: ""
            },
            catalogosPorPagina: [],
            currentPage: null,
            totalPages: null
        }
    }

    componentDidMount() {
        let miState = {...this.state};
        grillaCatalogos()
            .then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(response => {

                            miState.resultado.catalogos = response;
                            miState.resultado.codigo = 2000;
                            this.setState(miState);

                        })
                } else {
                    if (response.status === 500) {
                        this.setState({
                            resultado: {
                                codigo: 5000,
                                mensaje: "Error al listar los catalogos disponibles."
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

                            <CatalogoGrilla catalogos={this.state.catalogosPorPagina}/>
                        </Col>
                        <Col xs="12">
                            <Paginador totalRecords={this.state.resultado.catalogos.length}
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
                                onClick={() => this.props.history.push('/administracion/catalogos/nuevo')}>
                            Nueva <i className="fa fa-plus"></i>
                        </Button>
                    </CardHeader>
                    <CardBody>{content}</CardBody>
                </Card>
            </div>
        );
    };
}

export default Catalogos;