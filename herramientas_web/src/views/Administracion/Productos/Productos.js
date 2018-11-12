import React, {Component} from 'react';
import {Row, Col, Alert, Card, CardHeader, Button, CardBody} from 'reactstrap';
import {descargaProductosMasVendidos, grillaProductos} from '../../../services/ProductoServices';

import ProductoGrilla from '../../../components/Administracion/Productos/ProductoGrilla';
import Paginador from '../../../components/Paginador/Paginador';


class Productos extends Component {
    onPageChanged = data => {
        const {currentPage, totalPages, pageLimit} = data;
        const offset = (currentPage - 1) * pageLimit;
        const productos = this.state.resultado.productos.slice(offset, offset + pageLimit);

        let miState = {...this.state};
        miState.productosPorPagina = productos;
        miState.currentPage = currentPage;
        miState.totalPages = totalPages;
        this.setState(miState);
    }

    constructor() {
        super();
        this.state = {
            resultado: {
                productos: [],
                codigo: 0,
                mensaje: ""
            },
            productosPorPagina: [],
            currentPage: null,
            totalPages: null
        }
    }

    componentDidMount() {
        let miState = {...this.state};
        grillaProductos()
            .then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(response => {

                            miState.resultado.productos = response;
                            miState.resultado.codigo = 2000;
                            this.setState(miState);

                        })
                } else {
                    if (response.status === 500) {
                        this.setState({
                            resultado: {
                                codigo: 5000,
                                mensaje: "Error al listar los productos disponibles."
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

                            <ProductoGrilla productos={this.state.productosPorPagina}/>
                        </Col>
                        <Col xs="12">
                            <Paginador totalRecords={this.state.resultado.productos.length}
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
                                onClick={() => this.props.history.push(descargaProductosMasVendidos())}>
                            Mas Vendidos <i className="fa fa-plus"></i>
                        </Button>
                        <Button color="primary"
                                onClick={() => this.props.history.push('/administracion/productos/nuevo')}>
                            Nuevo Producto <i className="fa fa-plus"></i>
                        </Button>
                        <Button color="info"
                                onClick={() => this.props.history.push('/administracion/productocatalogo/unidades')}>
                            Adm.Presentaciones <i className="fa fa-plus"></i>
                        </Button>
                        <Button color="warning"
                                onClick={() => this.props.history.push('/administracion/productocatalogo/categoriaproductos')}>
                            Adm.Categorias <i className="fa fa-plus"></i>
                        </Button>
                    </CardHeader>
                    <CardBody>{content}</CardBody>
                </Card>
            </div>
        );
    };
}

export default Productos;