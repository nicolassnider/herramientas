import React from 'react';
import {Table} from 'reactstrap';

import PedidoProductoCatalogoFila from './PedidoProductoCatalogoFila';

const pedidoProductoCatalogos = (props) => {
    const style = {
        textAlign: 'center'
    }


    return (


        <Table size="sm" responsive>
            <thead>
            <tr>
                <th>Id Producto</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Cliente</th>
                <th>Saldo</th>
                <th>Rec</th>
                <th>Ent</th>
                <th>Cob</th>


                <th style={style}>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {
                props.pedidoProductoCatalogos.map((pedidoProductoCatalogo, index) => {
                    return <PedidoProductoCatalogoFila key={index}
                                                       pedidoProductoCatalogo={pedidoProductoCatalogo}/>
                })
            }
            </tbody>
        </Table>
    )
}

export default pedidoProductoCatalogos;