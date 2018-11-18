import React from 'react';
import {Table} from 'reactstrap';

import CampaniaFila from './CampaniaFila';

const campanias = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <Table size="sm" responsive>
            <thead>
            <tr>
                <th>Id</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Descripcion</th>
                <th>Estado</th>
                <th>Desactivar</th>
                <th style={style}>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {
                props.campanias.map((campania, index) => {
                    return <CampaniaFila key={index}
                                         campania={campania}/>
                })
            }
            </tbody>
        </Table>
    )
}

export default campanias;