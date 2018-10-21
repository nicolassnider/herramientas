import React from 'react';
import {Table} from 'reactstrap';

import ClienteFila from './ClienteFila';

const clientes = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <Table size="sm" responsive>
            <thead>
            <tr>
                <th>Id</th>
                <th>Categoria</th>
                <th>Nombre</th>
                <th>Revendedora</th>
                <th>Status</th>
                <th>es Madre?</th>
                <th>Fecha Alta</th>
                <th style={style}></th>
            </tr>
            </thead>
            <tbody>
            {
                props.clientes.map((cliente, index) => {
                    return <ClienteFila key={index}
                                        cliente={cliente}/>
                })
            }
            </tbody>
        </Table>
    )
}

export default clientes;