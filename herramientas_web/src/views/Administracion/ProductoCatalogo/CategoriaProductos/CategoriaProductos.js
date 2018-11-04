import React, {Component} from 'react';
import {Row, Col, Alert, Card, CardHeader, Button, CardBody} from 'reactstrap';
import {getTotalCategoriaProductos} from '../../../../services/CategoriaProductoServices';

import CategoriaProductosGrilla
    from '../../../../components/Administracion/ProductoCatalogo/CategoriaProductos/CategoriaProductosGrilla';
import Paginador from '../../../../components/Paginador/Paginador';


class CategoriaProductos extends Component {
    onPageChanged = data => {
        const {currentPage, totalPages, pageLimit} = data;
        const offset = (currentPage - 1) * pageLimit;
        const categoriaProductos = this.state.resultado.categoriaProductos.slice(offset, offset + pageLimit);

        let miState = {...this.state};
        miState.categoriaProductosPorPagina = categoriaProductos;
        miState.currentPage = currentPage;
        miState.totalPages = totalPages;
        this.setState(miState);
    }

    constructor() {
        super();
        this.state = {
            resultado: {
                categoriaProductos: [],
                codigo: 0,
                mensaje: ""
            },
            categoriaProductosPorPagina: [],
            currentPage: null,
            totalPages: null
        }
    }

    componentDidMount() {
        let miState = {...this.state};
        getTotalCategoriaProductos()
            .then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(response => {


                            miState.resultado.categoriaProductos = response;
                            miState.resultado.codigo = 2000;
                            this.setState(miState);


                        })
                } else {
                    if (response.status === 500) {
                        this.setState({
                            resultado: {
                                codigo: 5000,
                                mensaje: "Error al listar los categoriaProductos disponibles."
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

                            <CategoriaProductosGrilla categoriaProductos={this.state.categoriaProductosPorPagina}/>
                        </Col>
                        <Col xs="12">
                            <Paginador totalRecords={this.state.resultado.categoriaProductos.length}
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
                                onClick={() => this.props.history.push('/administracion/productocatalogo/categoriaproductos/nuevo')}>
                            Nueva Presentacion<i className="fa fa-plus"></i>
                        </Button>
                    </CardHeader>
                    <CardBody>{content}</CardBody>
                </Card>
            </div>
        );
    };
}

export default CategoriaProductos;