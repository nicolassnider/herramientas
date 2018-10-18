import React from 'react';
import {Table} from 'reactstrap';

import DeterminacionFila from './DeterminacionFila';

const determinaciones = (props) => {
    const style = {
        textAlign: 'center'
    }
    return (
        <Table size="sm" responsive>
            <thead>
            <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th style={style}></th>
            </tr>
            </thead>
            <tbody>
            {
                props.determinaciones.map((determinacion, index) => {
                    return <DeterminacionFila key={index}
                                              determinacion={determinacion}/>
                })
            }
            </tbody>
        </Table>
    )
}

export default determinaciones;