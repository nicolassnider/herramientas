import React, {Component} from 'react';
import {Row, Col, Alert, Card, CardHeader, Button, CardBody} from 'reactstrap';
import {getCatalogosPorProductoPorId} from '../../../services/ProductoCatalogoServices';

import ProductoCatalogoGrilla from '../../../components/Administracion/ProductoCatalogo/ProductoCatalogoGrilla';
import Paginador from '../../../components/Paginador/Paginador';


class ProductoCatalogos extends Component {
    onPageChanged = data => {
        const {currentPage, totalPages, pageLimit} = data;
        const offset = (currentPage - 1) * pageLimit;
        const productoCatalogos = this.state.resultado.productoCatalogos.slice(offset, offset + pageLimit);
        let miState = {...this.state};
        miState.productoCatalogosPorPagina = productoCatalogos;
        miState.currentPage = currentPage;
        miState.totalPages = totalPages;
        this.setState(miState);
    }

    constructor() {
        super();
        this.state = {
            resultado: {
                productoCatalogos: [],
                codigo: 0,
                mensaje: ""
            },
            productoCatalogosPorPagina: [],
            currentPage: null,
            totalPages: null
        }


    }

    componentDidMount() {
        let miState = {...this.state};
        getCatalogosPorProductoPorId(this.props.match.params.id)
            .then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(response => {

                            miState.resultado.productoCatalogos = response;
                            miState.resultado.codigo = 2000;
                            this.setState(miState);

                        })
                } else {
                    if (response.status === 500) {
                        this.setState({
                            resultado: {
                                codigo: 5000,
                                mensaje: "Error al listar los personas disponibles."
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

                            <ProductoCatalogoGrilla productoCatalogos={this.state.productoCatalogosPorPagina}/>
                        </Col>
                        <Col xs="12">
                            <Paginador totalRecords={this.state.resultado.productoCatalogos.length}
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

export default ProductoCatalogos;