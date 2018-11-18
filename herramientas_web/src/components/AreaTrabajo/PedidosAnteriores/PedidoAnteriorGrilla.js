import React from 'react';
import {Table} from 'reactstrap';

import PedidoAnteriorFila from './PedidoAnteriorFila';

const pedidoAnteriores = (props) => {
    console.log(props);
    const style = {
        textAlign: 'center'
    }

    return (
        <Table size="sm" responsive>
            <thead>
            <tr>
                <th>Id</th>
                <th>Fecha</th>
                <th>Recibido</th>
                <th>Check</th>
                <th>Cobrado</th>
                <th>Check</th>
                <th>Entregado</th>
                <th>Check</th>


                <th style={style}></th>
            </tr>
            </thead>
            <tbody>
            {
                props.pedidoAnteriores.map((pedidoAnterior, index) => {
                    return <PedidoAnteriorFila key={index}
                                               pedidoAnterior={pedidoAnterior}/>
                })
            }
            </tbody>
        </Table>
    )
}

export default pedidoAnteriores;