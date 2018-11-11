import React from 'react';
import {Table} from 'reactstrap';

import RemitoProductoFila from './RemitoProductoFila';

const remitoProductos = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <Table size="sm" responsive>
            <thead>
            <tr>
                <th>Remito</th>
                <th>Producto ID</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Recibido</th>
                <th style={style}></th>
            </tr>
            </thead>
            <tbody>
            {
                props.remitoProductos.map((remitoProducto, index) => {
                    return <RemitoProductoFila key={index}
                                               remitoProducto={remitoProducto}/>
                })
            }
            </tbody>
        </Table>
    )
}

export default remitoProductos;