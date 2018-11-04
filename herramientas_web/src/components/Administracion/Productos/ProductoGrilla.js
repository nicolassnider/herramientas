import React from 'react';
import {Table} from 'reactstrap';

import ProductoFila from './ProductoFila';

const productos = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <Table size="sm" responsive>
            <thead>
            <tr>
                <th>Id</th>
                <th>Categoria</th>
                <th>Descripción</th>
                <th>Presentación</th>
                <th style={style}></th>
            </tr>
            </thead>
            <tbody>
            {
                props.productos.map((producto, index) => {
                    return <ProductoFila key={index}
                                         producto={producto}/>
                })
            }
            </tbody>
        </Table>
    )
}

export default productos;