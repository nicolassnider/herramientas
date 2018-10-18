import React from 'react';
import {Table} from 'reactstrap';

import MetodoFila from './MetodoFila';

const metodos = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <Table size="sm" responsive>
            <thead>
            <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Determinación</th>
                <th>Estado</th>
                <th style={style}></th>
            </tr>
            </thead>
            <tbody>
            {
                props.metodos.map((metodo, index) => {
                    return <MetodoFila key={index}
                                       metodo={metodo}/>
                })
            }
            </tbody>
        </Table>
    )
}

export default metodos;