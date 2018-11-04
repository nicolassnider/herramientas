import React from 'react';
import {Table} from 'reactstrap';

import CategoriaProductoFila from './CategoriaProductosFila';

const categoriaProductos = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <Table size="sm" responsive>
            <thead>
            <tr>
                <th>id</th>
                <th>Descripcion</th>
                <th style={style}></th>
            </tr>
            </thead>
            <tbody>
            {
                props.categoriaProductos.map((categoriaProducto, index) => {
                    return <CategoriaProductoFila key={index}
                                                  categoriaProducto={categoriaProducto}/>
                })
            }
            </tbody>
        </Table>
    )
}

export default categoriaProductos;